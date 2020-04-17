export class QuantityUtils {
  public static fromParam(param: string | undefined): number {
    let quantityString = param || '';
    switch (quantityString) {
      case 'un':
      case 'une':
        return 1;
      case 'deux':
      case 'de':
        return 2;
      case 'trois':
        return 3;
      case 'quatre':
        return 4;
      case 'cinq':
        return 5;
      case 'six':
        return 6;
      case 'sept':
        return 7;
      case 'huit':
        return 8;
      case 'neuf':
        return 9;
      case 'dix':
        return 10;
      case 'onze':
        return 11;
      case 'douze':
        return 12;
      case 'treize':
        return 13;
      case 'quatorze':
        return 14;
      case 'quinze':
        return 15;
      case 'seize':
        return 16;
      case 'dix-sept':
        return 17;
      case 'dix-huit':
        return 18;
      case 'dix-neuf':
        return 19;
      case 'vingt':
        return 20;
    }
    if (/^(tou|des|les).*$/.test(quantityString)) {
      return Number.MAX_VALUE;
    }
    const quantityNumber: number = +quantityString;
    if (quantityNumber) {
      return quantityNumber;
    }
    return 1;
  }
}
