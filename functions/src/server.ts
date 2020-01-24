import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-config.json')),
  databaseURL: 'https://drawing-of-lot.firebaseio.com'
});

require('./app').listen(process.env.PORT || 9999);
