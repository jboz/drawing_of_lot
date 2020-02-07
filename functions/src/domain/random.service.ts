import { UnauthorizedError } from 'actions-on-google';
import admin from 'firebase-admin';
import Fuse from 'fuse.js';
import random from 'lodash/random';
import uuid from 'uuid/v4';
import { Group, Member, Purpose } from './group.model';
import { NotFoundError } from './not-found.error';
import { TooManyResultError } from './too-many-result.error';
import { User } from './user.model';

export const byGroupId = (userId: string, groupId: string, token: string, purposeName?: string): Promise<string> =>
  admin
    .firestore()
    .doc(`/users/${userId}`)
    .get()
    .then(doc => doc.data() as User)
    .then(user => {
      if (token && user.token !== token) {
        throw new UnauthorizedError('Invalid token');
      }
      return 'Authorized';
    })
    .then(() => getMemberRandom(userId, groupId, purposeName));

export const byGroupName = (userId: string, groupName: string, purposeName?: string): Promise<string> =>
  admin
    .firestore()
    .doc(`/users/${userId}`)
    .get()
    .then(doc => doc.data() as User)
    .then(() =>
      admin
        .firestore()
        .collection(`/users/${userId}/groups`)
        .get()
    )
    .then(results => results.docs.map(doc => ({ ...doc.data(), id: doc.id } as Group)))
    .then(groups => new Fuse(groups, { keys: ['name'] }).search(groupName))
    .then(result => {
      if (result.length === 0) {
        throw new NotFoundError(groupName);
      }
      if (result.length > 1) {
        throw new TooManyResultError(`Label '${groupName}' match many groups : ${JSON.stringify(result.map(group => group.name))}`);
      }
      return result[0];
    })
    .then(group => getMemberRandom(userId, group.id, purposeName));

const getMemberRandom = (userId: string, groupId: string, purposeName?: string) =>
  admin
    .firestore()
    .collection(`/users/${userId}/groups/${groupId}/members`)
    .get()
    .then(snap => snap.docs.map(doc => ({ ...doc.data() } as Member)))
    .then(members => {
      if (purposeName) {
        return admin
          .firestore()
          .collection(`/users/${userId}/groups/${groupId}/purposes`)
          .get()
          .then(results => results.docs.map(doc => ({ ...doc.data(), id: doc.id } as Purpose)))
          .then(purposes => ({ purposes: purposes, result: new Fuse(purposes, { keys: ['label'] }).search(purposeName) }))
          .then(data => {
            if (data.result.length === 0) {
              return createPurpose(userId, groupId, purposeName);
            }
            if (data.result.length > 1) {
              throw new TooManyResultError(
                `Label '${purposeName}' match many purposes : ${JSON.stringify(data.result.map(purpose => purpose.label))}`
              );
            }
            return data.result[0];
          })
          .then(purpose =>
            admin
              .firestore()
              .collection(`/users/${userId}/groups/${groupId}/purposes/${purpose.id}/uses`)
              .get()
              .then(snap => snap.docs.map(doc => ({ ...doc.data() } as Member)))
              .then(usesMembers => usesMembers.map(member => member.label))
              .then(usesMembers => {
                if (usesMembers.length >= members.length) {
                  return admin
                    .firestore()
                    .doc(`/users/${userId}/groups/${groupId}/purposes/${purpose.id}`)
                    .delete()
                    .then(() => createPurpose(userId, groupId, purpose.label))
                    .then(newPurpose => (purpose.id = newPurpose.id))
                    .then(() => members);
                }
                return members.filter(member => !usesMembers.includes(member.label));
              })
              .then(members => members[random(0, members.length - 1)])
              .then(member =>
                admin
                  .firestore()
                  .collection(`/users/${userId}/groups/${groupId}/purposes/${purpose.id}/uses`)
                  .add(member)
                  .then(() => member.label)
              )
          );
      }
      return members[random(0, members.length - 1)].label;
    });

const createPurpose = (userId: string, groupId: string, purposeName: string): Promise<Purpose> => {
  const purpose = { id: uuid(), label: purposeName } as Purpose;
  return admin
    .firestore()
    .doc(`/users/${userId}/groups/${groupId}/purposes/${purpose.id}`)
    .set(purpose)
    .then(() => purpose);
};
