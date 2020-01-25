import { Contexts, DialogflowConversation } from 'actions-on-google';
import admin from 'firebase-admin';
import { byGroupName } from '../../domain/random.service';
import IntentHandler from './intent.handler';

interface Parameters {
  group: string;
}

export default class RandomIntentHandler implements IntentHandler {
  public name = 'random_intent';

  action(conv: DialogflowConversation<{ uid: string }, any, Contexts>, params: Parameters) {
    return admin
      .auth()
      .getUserByEmail(conv.user.email || '')
      .then(user => byGroupName(user.uid, params.group))
      .then(member => conv.ask(`La personne tiré au sort est : ${member}`));
  }
}
