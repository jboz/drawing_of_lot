import { SignIn, Suggestions } from 'actions-on-google';
import IntentHandler from './intent.handler';

export default class HelloIntentHandler implements IntentHandler {
  public name = 'Default Welcome Intent';
  public dialogflowApp: any;

  action(conv: any, params: any, signin: any) {
    if (signin && signin.status === 'OK') {
      conv.ask(`Salut ${conv.user.profile.payload.name}.\nPour quel groupe souhaites-tu un tirage un sort ?`);
      conv.ask(new Suggestions(['Tirer au sort un nom du groupe Cortex']));
    }
    return conv.ask(new SignIn(`Connection à l'application requise.`));
  }
}
