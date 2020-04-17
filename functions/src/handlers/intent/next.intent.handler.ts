import { Contexts, DialogflowConversation } from 'actions-on-google';
import admin from 'firebase-admin';
import { ConversationData } from '../../domain/conversation-data-model';
import { GroupUndefinedError } from '../../domain/group-undefined.error';
import { byGroupName } from '../../domain/random.service';
import { RandomResponse } from '../../tools/random.response.utils';
import IntentHandler from './intent.handler';

export default class NextIntentHandler implements IntentHandler {
  public name = 'next_intent';

  action(conv: DialogflowConversation<any, ConversationData, Contexts>) {
    const group = conv.contexts.input['group']?.parameters.name as string;
    if (!group) {
      throw new GroupUndefinedError();
    }
    const purpose = conv.contexts.input['purpose']?.parameters.label as string;
    return admin
      .auth()
      .getUserByEmail(conv.user.email || '')
      .then((user) => byGroupName(user.uid, group, purpose, 1))
      .then((members) => conv.ask(RandomResponse.getResult(members)))
      .then((_) => conv.ask(RandomResponse.getQuestion()));
  }
}
