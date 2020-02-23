import { LinkOutSuggestion } from 'actions-on-google';
import IntentHandler from './intent.handler';
import admin = require('firebase-admin');

export default class SignInIntentHandler implements IntentHandler {
  public name = 'Get Signin';
  public dialogflowApp: any;

  async action(conv: any, params: any, signin: { status: string }) {
    const auth = admin.auth();

    if (signin.status === 'OK') {
      const { email } = conv.user;
      if (!conv.data.uid && email) {
        try {
          conv.data.uid = (await auth.getUserByEmail(email)).uid;
        } catch (e) {
          if (e.code !== 'auth/user-not-found') {
            throw e;
          }
          // If the user is not found, create a new Firebase auth user
          // using the email obtained from the Google Assistant
          conv.data.uid = (await auth.createUser({ email })).uid;
        }
      }

      return conv
        .ask(`Bonjour ${conv.user.profile.payload.name}.\nQue puis-je faire pour toi ?`)
        .add(new LinkOutSuggestion({ name: `Liste des groupes`, url: 'http://drawing-of-lot.ifocusit.ch/groups' }));
    } else {
      return conv.ask(`Vous devez vous identifier pour utiliser cette assistant, désolé.`).close();
    }
  }
}
