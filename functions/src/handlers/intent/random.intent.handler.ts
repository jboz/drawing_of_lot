import { Contexts, DialogflowConversation } from 'actions-on-google';
import admin from 'firebase-admin';
import { ConversationData } from '../../domain/conversation-data-model';
import { GroupUndefinedError } from '../../domain/group-undefined.error';
import { Parameters } from '../../domain/parameters.model';
import { byGroupName } from '../../domain/random.service';
import { QuantityUtils } from '../../tools/quantity.utils';
import { RandomResponse } from '../../tools/random.response.utils';
import IntentHandler from './intent.handler';

export default class RandomIntentHandler implements IntentHandler {
  public name = 'random_intent';

  action(conv: DialogflowConversation<any, ConversationData, Contexts>, params: Parameters) {
    if (!params.group) {
      throw new GroupUndefinedError();
    }
    const group = params.group.split('pour')[0].trim();
    const purpose = params.group.indexOf('pour') > -1 ? params.group.split('pour')[1].trim() : params.purpose?.trim();
    const quantity = QuantityUtils.fromParam(params.quantity);
    return admin
      .auth()
      .getUserByEmail(conv.user.email || '')
      .then((user) => byGroupName(user.uid, group, purpose, quantity))
      .then((members) => conv.ask(RandomResponse.getResult(members)))
      .then((_) => conv.ask(RandomResponse.getQuestion()))
      .then(
        (_) =>
          (conv.contexts.output = {
            group: { lifespan: 10, parameters: { name: group } },
            purpose: { lifespan: 10, parameters: { label: purpose } },
          })
      );
  }
}
