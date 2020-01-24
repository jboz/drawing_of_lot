import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import admin from 'firebase-admin';
import random from 'lodash/random';
import { User } from './user.model';

const wrap = (fn: any) => (...args: any) => fn(...args).catch(args[2]);

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// curl -G "https://drawing-of-lot.web.app/api/v1/ping"
app.get('/ping', (_, res) => res.status(200).send('Server is up!'));

app.get(
  '/groups/:groupId/random',
  wrap((requested: Request, response: Response) => {
    const userId = requested.get('x-user-id') || requested.query.uid;
    const token = requested.get('x-token') || requested.query.token;
    if (!userId || !token) {
      response.status(400).send();
    }
    return admin
      .firestore()
      .doc(`/users/${userId}`)
      .get()
      .then(doc => doc.data() as User)
      .then(user => {
        if (user.token !== token) {
          response.status(403).send();
          throw new Error('Invalid token');
        }
        return 'Authorized';
      })
      .then(() =>
        admin
          .firestore()
          .collection(`/users/${userId}/groups/${requested.params.groupId}/members`)
          .get()
      )
      .then(snap => snap.docs[random(0, snap.docs.length - 1)])
      .then(doc => doc.data().label)
      .then(member => response.status(200).send(member));
  })
);

export const main = express();
main.use('/api/v1', app);
module.exports = main;
