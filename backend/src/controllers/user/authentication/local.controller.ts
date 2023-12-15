import { Router } from 'express';
import { validate, vendors, wrapper } from '@jmrl23/express-helper';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserService } from '../../../services/user.service';
import { UserLocalLoginDto } from '../../../dtos/UserLocalLogin.dto';
import { UserLocalService } from '../../../services/user-local.service';
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
      try {
        const userLocalService = await UserLocalService.getInstance();
        const userAuthLocal = await userLocalService.login(username, password);
        const userService = await UserService.getInstance();
        const user = await userService.getUserById(userAuthLocal.User[0].id);

        if (!user) throw vendors.httpErrors.Unauthorized('User not found');

        done(null, user);
      } catch (error: unknown) {
        done(error);
      }
    },
  ),
);

controller.post(
  '/',
  validate('BODY', UserLocalLoginDto),
  wrapper(function (request, response, next) {
    const successRedirect = `${request.protocol}://${request.get(
      'host',
    )}/user/session`;

    passport.authenticate('local', {
      successRedirect,
    })(request, response, next);
  }),
);
