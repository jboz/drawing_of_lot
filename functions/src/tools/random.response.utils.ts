import random from 'lodash/random';

const RESULTATS = [`Le résultat du tirage au sort est: `, `Le résultat est: `, '', 'Voilà: ', 'ce sera: '];
const RESPONSES = [`Autre chose ?`, `Que puis-je faire d'autres ?`, `Est-ce que cela vous convient ?`];

export class RandomResponse {
  public static getResult = (member: string[]) => {
    return RESULTATS[random(0, RESULTATS.length - 1)] + member.join(', ');
  };

  public static getQuestion = () => {
    return RESPONSES[random(0, RESPONSES.length - 1)];
  };
}
