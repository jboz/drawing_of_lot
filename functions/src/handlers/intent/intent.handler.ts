import { Contexts, DialogflowConversation } from 'actions-on-google';

export default interface IntentHandler {
  name: string;
  action(conv: DialogflowConversation<{ uid: string }, any, Contexts>, params: any, signin: any): any;
}
