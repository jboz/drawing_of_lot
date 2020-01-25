import { UnauthorizedError } from 'actions-on-google';
import { Request, Response } from 'express';
import { byGroupId } from '../domain/random.service';

export const handler = (requested: Request, response: Response) => {
  const userId = requested.get('x-user-id') || requested.query.uid;
  const token = requested.get('x-token') || requested.query.token;
  if (!userId || !token) {
    response.status(400).send();
  }
  return byGroupId(userId, requested.params.groupId, token)
    .then(member => response.status(200).send(member))
    .catch(error => {
      if (error instanceof UnauthorizedError) {
        response.status(403).send();
      }
    });
};
