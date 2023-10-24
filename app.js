import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-error';
import tweetRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { connectDB } from './db/database.js';
import { csrfCheck } from './middleware/csrf.js';
import { limit } from './middleware/rate-limiter.js';
import yaml from 'yamljs';
import swaggerUI from 'swagger-ui-express';

const app = express();

const openAPIDocument = yaml.load('./api/openapi.yaml');
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('tiny'));
app.use(limit);

app.use(csrfCheck);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openAPIDocument));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', config.cors.allowedOrigin);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization, _csrf-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST , PUT, DELETE');
    next();
});

app.use('/tweets', tweetRouter);
app.use('/auth', authRouter)
app.get('/', (req, res) => {
    res.send('API START !!!')
});

app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

connectDB().then(() => {
    console.log(`Server started at ${new Date()}`)
    const server = app.listen(config.port);
    initSocket(server);
}).catch(console.error);
