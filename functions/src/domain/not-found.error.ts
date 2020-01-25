export class NotFoundError extends Error {
  constructor(groupeName: string) {
    super();
    this.name = 'NorFoundEror';
    this.message = groupeName;
  }
}
