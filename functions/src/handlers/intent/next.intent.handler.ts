import { Contexts, DialogflowConversation } from 'actions-on-google';
import admin from 'firebase-admin';
import { ConversationData } from '../../domain/conversation-data-model';
import { GroupUndefinedError } from '../../domain/group-undefined.error';
import { byGroupName } from '../../domain/random.service';
import IntentHandler from './intent.handler';

export default class NextIntentHandler implements IntentHandler {
  public name = 'next_intent';

  action(conv: DialogflowConversation<any, ConversationData, Contexts>, params: any) {
    const group = conv.user.storage.group;
    if (!group) {
      throw new GroupUndefinedError();
    }
    const purpose = conv.user.storage.purpose;
    return admin
      .auth()
      .getUserByEmail(conv.user.email || '')
      .then(user => byGroupName(user.uid, group, purpose))
      .then(member => conv.ask(`Le résultat du tirage au sort est : ${member}`))
      .then(_ => conv.ask(`Autre chose ?`))
      .then(_ => (conv.user.storage = { group, purpose }));
  }
}
