import { type Prisma } from '@prisma/client';

export declare global {
  export interface GlobalUser
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

  declare namespace Express {
    export interface Request {
      user?: User | null;
    }

    export interface User extends null, GlobalUser {}
  }
}
