import { validate, vendors, wrapper } from '@jmrl23/express-helper';
import { Router } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaService } from '../../../services/prisma.service';
import { UserService } from '../../../services/user.service';
import { UserLoginLocalDto } from '../../../dtos/UserLoginLocal.dto';
import passport from 'passport';

export const controller = Router();

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async function (_request, username, password, done) {
      const prismaService = PrismaService.getInstance();
      const prismaClient = prismaService.getClient();
      const user = await prismaClient.user.findFirst({
        where: {
          username,
        },
        select: {
          id: true,
          username: true,
          password: true,
        },
      });

      if (!user) {
        return done(
          new vendors.httpErrors.Unauthorized('User not exist'),
          false,
        );
      }

      if (!(await UserService.comparePassword(password, user.password))) {
        return done(
          new vendors.httpErrors.Unauthorized('Password is incorrect'),
          false,
        );
      }

      const _user = { ...user } as Express.User as Record<string, unknown>;

      delete _user.password;

      done(null, user);
    },
  ),
);

controller.post(
  '/',
  validate('BODY', UserLoginLocalDto),
  wrapper(function (request, response, next) {
    const successRedirect = `${request.protocol}://${request.get(
      'host',
    )}/user/session`;

    passport.authenticate('local', {
      successRedirect,
    })(request, response, next);
  }),
);
