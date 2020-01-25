export class NotFoundError extends Error {
  constructor(groupName: string) {
    super();
    this.name = 'NotFoundError';
    this.message = groupName;
  }
}
