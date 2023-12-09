import { type Prisma } from '@prisma/client';

export declare global {
  export interface GlobalUser
    extends Prisma.UserGetPayload<{
      select: {
        id: true;
        username: true;
      };
    }> {}

  declare namespace Express {
    export interface Request {
      user?: User;
    }

    export interface User extends null, GlobalUser {}
  }
}
