import { validate, wrapper } from '@jmrl23/express-helper';
import { Router } from 'express';
import { UserLocalService } from '../../services/user-local.service';
import { UserLocalRegisterDto } from '../../dtos/UserLocalRegister.dto';
import { PrismaService } from '../../services/prisma.service';

export const controller = Router();

(async function () {
  const userLocalService = await UserLocalService.getInstance();
  const prismaService = PrismaService.getInstance();
  const prismaClient = prismaService.getClient();

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
      validate('BODY', UserLocalRegisterDto),
      wrapper(async function (request) {
        const userAuthLocal = await userLocalService.register(
          request.body.username,
          request.body.password,
        );
        const user = await prismaClient.user.create({
          data: {
            userAuthLocalId: userAuthLocal.id,
          },
          include: {
            UserInformation: true,
            UserAuthLocal: {
              select: {
                username: true,
              },
            },
          },
        });

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
})();
