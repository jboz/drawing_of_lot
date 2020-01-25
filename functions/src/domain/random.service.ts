import { UnauthorizedError } from 'actions-on-google';
import admin from 'firebase-admin';
import Fuse from 'fuse.js';
import random from 'lodash/random';
import { Group } from './group.model';
import { NotFoundError } from './not-found.error';
import { User } from './user.model';

export const byGroupId = (userId: string, groupId: string, token: string): Promise<string> =>
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
    .then(() =>
      admin
        .firestore()
        .collection(`/users/${userId}/groups/${groupId}/members`)
        .get()
    )
    .then(snap => snap.docs[random(0, snap.docs.length - 1)])
    .then(doc => doc.data().label);

export const byGroupName = (userId: string, groupName: string): Promise<string> =>
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
      return result[0];
    })
    .then(group =>
      admin
        .firestore()
        .collection(`/users/${userId}/groups/${group.id}/members`)
        .get()
    )
    .then(snap => snap.docs[random(0, snap.docs.length - 1)])
    .then(doc => doc.data().label);
