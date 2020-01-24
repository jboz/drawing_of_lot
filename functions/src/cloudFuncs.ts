import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const webApi = functions.https.onRequest(require('./app'));
