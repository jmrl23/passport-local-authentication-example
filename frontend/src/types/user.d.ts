import { Prisma } from '@prisma/client';

export interface User
  extends Prisma.UserGetPayload<{
    include: {
      UserInformation: true;
      UserAuthLocal: {
        select: {
          username: true;
        };
      };
    };
  }> {}
