export class TooManyResultError extends Error {
  constructor(groupName: string) {
    super();
    this.name = 'TooManyResultError';
    this.message = groupName;
  }
}
