import { Contexts, dialogflow, DialogflowApp, DialogflowConversation, LinkOutSuggestion } from 'actions-on-google';
import { GroupUndefinedError } from '../domain/group-undefined.error';
import { NotFoundError } from '../domain/not-found.error';
import { TooManyResultError } from '../domain/too-many-result.error';
import HelloIntentHandler from './intent/hello.intent.handler';
import IntentHandler from './intent/intent.handler';
import NextIntentHandler from './intent/next.intent.handler';
import RandomIntentHandler from './intent/random.intent.handler';
import SignInIntentHandler from './intent/signin.intent.handler';

const app: DialogflowApp<any, any, Contexts, DialogflowConversation<{ uid: string }, any, Contexts>> = dialogflow({
  debug: true,
  clientId: '910775818813-422gf90512qlatumavq54sqar51tq61o.apps.googleusercontent.com'
});

app.catch((conv: DialogflowConversation<{ uid: string }, any, Contexts>, error: any) => {
  if (error instanceof GroupUndefinedError) {
    return conv
      .ask(`Pouvez-vous préciser le groupe ?`)
      .add(new LinkOutSuggestion({ name: `Liste des groupes`, url: 'http://drawing-of-lot.ifocusit.ch/groups' }));
  }
  if (error instanceof NotFoundError) {
    return conv
      .ask(`Le groupe '${error.message}' n'a pas été trouvé.\nVoulez-vous reformuler la question ?`)
      .add(new LinkOutSuggestion({ name: `Liste des groupes`, url: 'http://drawing-of-lot.ifocusit.ch/groups' }));
  }
  if (error instanceof TooManyResultError) {
    return conv
      .ask(
        `La recherche du groupe ou du propos à renvoyer plusieurs résults.\n
      Assurez-vous que le nom du groupe ou du propos soit facilement identifiable.\n
      Voulez-vous reformuler la question ?`
      )
      .add(new LinkOutSuggestion({ name: `Liste des groupes`, url: 'http://drawing-of-lot.ifocusit.ch/groups' }));
  }
  console.error(error);
  return conv.ask(`Une erreur est survenue.\nPouvez-vous répéter la question ?`);
});

export const INTENT_HANDLERS: IntentHandler[] = [
  new HelloIntentHandler(),
  new SignInIntentHandler(),
  new RandomIntentHandler(),
  new NextIntentHandler()
];

INTENT_HANDLERS.forEach((intentHandler: IntentHandler) => {
  app.intent(intentHandler.name, intentHandler.action);
});

export const handler = app;
