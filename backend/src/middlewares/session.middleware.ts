import expressSession from 'express-session';
import env from 'env-var';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import ms from 'ms';

const redisClient = createClient({
  url: env.get('REDIS_URL').default('').asString(),
});

redisClient.connect().catch(console.error);

export const sessionMiddleware = expressSession({
  secret: env.get('SESSION_SECRET').default('').asString(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: ms('30d'),
  },
  store: new RedisStore({
    client: redisClient,
    prefix: 'session:',
  }),
});
