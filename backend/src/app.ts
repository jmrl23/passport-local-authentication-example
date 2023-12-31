import env from 'env-var';
import express from 'express';
import { corsMiddleware } from './middlewares/cors.middleware';
import { join } from 'node:path';
import { yellow } from 'colorette';
import { logger } from './utils/logger';
import { morganMiddleware } from './middlewares/morgan.middleware';
import {
  errorHandler,
  registerControllers,
  vendors,
  wrapper,
} from '@jmrl23/express-helper';
import { sessionMiddleware } from './middlewares/session.middleware';
import passport from 'passport';

export const app = express();

// configurations
app.disable('x-powered-by');

// middlewares
app.use(
  morganMiddleware(),
  corsMiddleware({
    origin: env.get('CORS_ORIGIN').default('*').asString(),
    credentials: true,
  }),
  express.json({
    strict: true,
  }),
  express.urlencoded({
    extended: true,
  }),
  sessionMiddleware,
  passport.session(),
);

// controllers/ routes
const controllers = registerControllers(
  join(__dirname, './controllers'),
  '/',
  (controllers) => {
    for (const { filePath, controller } of controllers) {
      logger.info(
        `Controller ${yellow('Register')} {%s => %s}`,
        controller,
        filePath,
      );
    }
  },
);
app.use(controllers);

app.use(
  // 404 error
  wrapper((request) => {
    throw new vendors.httpErrors.NotFound(
      `Cannot ${request.method} ${request.path}`,
    );
  }),
  // custom error handler
  errorHandler((error, _request, _response, next) => {
    if (!(error instanceof vendors.httpErrors.HttpError)) {
      if (error instanceof Error) {
        if ('statusCode' in error && typeof error.statusCode === 'number') {
          error = vendors.httpErrors.createHttpError(
            error.statusCode,
            error.message,
          );
        }
      }
    }

    if (error instanceof Error) {
      logger.error(error.stack);
    }

    next(error);
  }),
);
