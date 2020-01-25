import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const wrap = (fn: any) => (...args: any) => fn(...args).catch(args[2]);

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// curl -G "https://drawing-of-lot.web.app/api/v1/ping"
app.get('/ping', (_, res) => res.status(200).send('Server is up!'));
app.get('/groups/:groupId/random', wrap(require('./handlers/random.handler').handler));
app.post('/dialogflow', express.json(), require('./handlers/dialogflow.handler').handler);

export const main = express();
main.use('/api/v1', app);
module.exports = main;
