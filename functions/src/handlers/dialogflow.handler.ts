import { Contexts, dialogflow, DialogflowApp, DialogflowConversation } from 'actions-on-google';
import { NotFoundError } from '../domain/not-found.error';
import { TooManyResultError } from '../domain/too-many-result.error';
import HelloIntentHandler from './intent/hello.intent.handler';
import IntentHandler from './intent/intent.handler';
import RandomIntentHandler from './intent/random.intent.handler';
import SignInIntentHandler from './intent/signin.intent.handler';

const app: DialogflowApp<any, any, Contexts, DialogflowConversation<{ uid: string }, any, Contexts>> = dialogflow({
  debug: true,
  clientId: '910775818813-422gf90512qlatumavq54sqar51tq61o.apps.googleusercontent.com'
});

app.catch((conv: any, error: any) => {
  if (error instanceof NotFoundError) {
    return conv.ask(`Le groupe '${error.message}' n'a pas été trouvé.\nAssurez-vous qu'il existe bien.`);
  }
  if (error instanceof TooManyResultError) {
    return conv.ask(
      `La recherche du groupe ou du propos à renvoyer plusieurs résults.\n
      Assurez-vous que le nom du groupe ou du propos soit facilement identifiable.`
    );
  }
  console.error(error);
  return conv.ask(`Une erreur est survenue.\nPouvez-vous répéter la question?`);
});

export const INTENT_HANDLERS: IntentHandler[] = [new HelloIntentHandler(), new SignInIntentHandler(), new RandomIntentHandler()];

INTENT_HANDLERS.forEach((intentHandler: IntentHandler) => {
  app.intent(intentHandler.name, intentHandler.action);
});

export const handler = app;
