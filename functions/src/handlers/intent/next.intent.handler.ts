import { Contexts, DialogflowConversation } from 'actions-on-google';
import admin from 'firebase-admin';
import random from 'lodash/random';
import { ConversationData } from '../../domain/conversation-data-model';
import { GroupUndefinedError } from '../../domain/group-undefined.error';
import { byGroupName } from '../../domain/random.service';
import IntentHandler from './intent.handler';

const RESULTATS = [`Le résultat du tirage au sort est: `, `Le résultat est: `, '', 'Voilà: ', 'ce sera: '];
const RESPONSES = [`Autre chose ?`, `Que puis-je faire d'autres ?`, `Est-ce que cela vous convient ?`];

const getResult = (member: string) => {
  return RESULTATS[random(0, RESULTATS.length - 1)] + member;
};

const getQuestion = () => {
  return RESPONSES[random(0, RESPONSES.length - 1)];
};

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
      .then((user) => byGroupName(user.uid, group, purpose))
      .then((member) => conv.ask(getResult(member)))
      .then((_) => conv.ask(getQuestion()))
      .then((_) => (conv.user.storage = { group, purpose }));
  }
}
