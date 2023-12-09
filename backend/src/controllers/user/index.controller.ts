import { validate, wrapper } from '@jmrl23/express-helper';
import { Router } from 'express';
import { UserService } from '../../services/user.service';
import { UserRegisterLocalDto } from '../../dtos/UserRegisterLocal.dto';

export const controller = Router();

controller

  .get(
    '/session',
    wrapper(function (request) {
      const user = request.user ?? null;

      return {
        user,
      };
    }),
  )

  .post(
    '/register',
    validate('BODY', UserRegisterLocalDto),
    wrapper(async function (request) {
      const userService = await UserService.getInstance();
      const user = await userService.registerUserLocal(
        request.body.username,
        request.body.password,
      );

      return {
        user,
      };
    }),
  )

  .get(
    '/logout',
    wrapper(function (request, response) {
      request.logOut((error) => {
        if (error) throw error;

        response.json({ success: true });
      });
    }),
  );
