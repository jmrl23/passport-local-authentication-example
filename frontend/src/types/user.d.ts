import { Prisma } from '@prisma/client';

export interface User
  extends Prisma.UserGetPayload<{
    select: {
      id: string;
      username: string;
    };
  }> {}
