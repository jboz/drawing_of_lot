import { UnauthorizedError } from 'actions-on-google';
import admin from 'firebase-admin';
import Fuse from 'fuse.js';
import difference from 'lodash/difference';
import random from 'lodash/random';
import uuid from 'uuid/v4';
import { Group, Member, Purpose } from './group.model';
import { NotFoundError } from './not-found.error';
import { TooManyResultError } from './too-many-result.error';
import { User } from './user.model';

/**
 * Get random member by group id.
 */
export const byGroupId = (userId: string, groupId: string, token: string, purposeName?: string): Promise<string[]> =>
  admin
    .firestore()
    .doc(`/users/${userId}`)
    .get()
    .then((doc) => doc.data() as User)
    .then((user) => {
      if (token && user.token !== token) {
        throw new UnauthorizedError('Invalid token');
      }
      return 'Authorized';
    })
    .then(() => getMemberRandom(userId, groupId, purposeName, 1));

/**
 * Get random member by group name.
 */
export const byGroupName = (userId: string, groupName: string, purposeName: string | undefined, quantity: number): Promise<string[]> =>
  getGroupId(userId, groupName).then((group) => getMemberRandom(userId, group.id, purposeName, quantity));

/**
 * Look for the group id from group name.
 */
const getGroupId = (userId: string, groupName: string): Promise<Group> =>
  admin
    .firestore()
    .doc(`/users/${userId}`)
    .get()
    .then((doc) => doc.data() as User)
    .then(() => admin.firestore().collection(`/users/${userId}/groups`).get())
    .then((results) => results.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Group)))
    .then((groups) => new Fuse(groups, { keys: ['name'] }).search(groupName))
    .then((result) => {
      if (result.length === 0) {
        throw new NotFoundError(groupName);
      }
      if (result.length > 1) {
        throw new TooManyResultError(`Label '${groupName}' match many groups : ${JSON.stringify(result.map((group) => group.name))}`);
      }
      return result[0];
    });

/**
 * Get random member by group id.
 */
const getMemberRandom = (userId: string, groupId: string, purposeName: string | undefined, quantityAsked: number): Promise<string[]> =>
  admin
    .firestore()
    .collection(`/users/${userId}/groups/${groupId}/members`)
    .get()
    .then((snap) => snap.docs.map((doc) => ({ ...doc.data() } as Member)))
    .then((groupMembers) => groupMembers.map((member) => member.label))
    .then((groupMembers) => constructInput(`/users/${userId}/groups/${groupId}/purposes`, purposeName, groupMembers))
    .then((input) => {
      const results: string[] = [];
      const quantity = Math.min(input.members.length, quantityAsked);
      randomExtractTo(difference(input.members, input.filter), quantity, results);
      if (results.length < quantity) {
        randomExtractTo(difference(input.members, results), quantity - results.length, results);
      }

      if (results.length === input.members.length && input.purpose) {
        return admin
          .firestore()
          .doc(`/users/${userId}/groups/${groupId}/purposes/${input.purpose?.id}`)
          .delete()
          .then(() => results);
      }

      if (results.length !== input.members.length && input.purpose) {
        const batch = admin.firestore().batch();
        results.forEach((member) => {
          const doc = admin.firestore().collection(`/users/${userId}/groups/${groupId}/purposes/${input.purpose?.id}/uses`).doc();
          batch.create(doc, { label: member });
        });
        return batch.commit().then(() => results);
      }
      return Promise.resolve(results);
    });

const randomExtractTo = (list: string[], quantity: number, results: string[]): string[] => {
  if (quantity === 0 || list.length === 0) {
    return results;
  }
  results.push(list[random(0, list.length - 1)]);
  return randomExtractTo(difference(list, results), quantity - 1, results);
};

const createPurpose = (purposePath: string, purposeName: string): Promise<Purpose> => {
  const purpose = { id: uuid(), label: purposeName } as Purpose;
  return admin
    .firestore()
    .doc(`${purposePath}/${purpose.id}`)
    .set(purpose)
    .then(() => purpose);
};

interface RandomInput {
  members: string[];
  purpose?: Purpose;
  filter: string[];
}

const constructInput = (
  purposePath: string,
  purposeName: string | undefined,
  groupMembers: string[]
): Promise<RandomInput> | RandomInput => {
  if (purposeName) {
    return admin
      .firestore()
      .collection(purposePath)
      .get()
      .then((results) => results.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Purpose)))
      .then((purposes) => ({ purposes: purposes, result: new Fuse(purposes, { keys: ['label'] }).search(purposeName) }))
      .then((data) => {
        if (data.result.length === 0) {
          return createPurpose(purposePath, purposeName);
        }
        if (data.result.length > 1) {
          throw new TooManyResultError(
            `Label '${purposeName}' match many purposes : ${JSON.stringify(data.result.map((purpose) => purpose.label))}`
          );
        }
        return data.result[0];
      })
      .then((purpose) =>
        admin
          .firestore()
          .collection(`${purposePath}/${purpose.id}/uses`)
          .get()
          .then((snap) => snap.docs.map((doc) => ({ ...doc.data() } as Member)))
          .then((members) => members.map((member) => member.label))
          .then((usesMembers) => {
            if (usesMembers.length >= groupMembers.length) {
              // clear existing purpose
              return admin
                .firestore()
                .doc(`${purposePath}/${purpose.id}`)
                .delete()
                .then(() => createPurpose(purposePath, purpose.label))
                .then((newPurpose) => (purpose.id = newPurpose.id))
                .then(() => ({ members: groupMembers, filter: [] })); // nothing to filter
            }
            return { members: groupMembers, purpose, filter: usesMembers };
          })
      );
  }
  return { members: groupMembers, filter: [] }; // nothing to filter
};
