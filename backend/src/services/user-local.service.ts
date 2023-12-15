import type { PrismaClient, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { vendors } from '@jmrl23/express-helper';
import { compare, genSalt, hash } from 'bcrypt';

export class UserLocalService {
  private static instance: UserLocalService;

  private constructor(private readonly prismaClient: PrismaClient) {}

  public static async createInstance(): Promise<UserLocalService> {
    const prismaService = PrismaService.getInstance();
    const prismaClient = prismaService.getClient();
    const instance = new UserLocalService(prismaClient);

    return instance;
  }

  public static async getInstance(): Promise<UserLocalService> {
    if (!UserLocalService.instance) {
      UserLocalService.instance = await UserLocalService.createInstance();
    }

    return UserLocalService.instance;
  }

  public async register(
    username: string,
    password: string,
  ): Promise<
    Prisma.UserAuthLocalGetPayload<{
      include: {
        User: {
          select: {
            id: true;
          };
        };
      };
    }>
  > {
    const existing = await this.prismaClient.userAuthLocal.findUnique({
      where: {
        username,
      },
      include: {
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (existing) {
      throw new vendors.httpErrors.Conflict('User already exists');
    }

    const userAuthLocal = await this.prismaClient.userAuthLocal.create({
      data: {
        username,
        password: await UserLocalService.passwordHash(password),
      },
      include: {
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    return userAuthLocal;
  }

  public async login(
    username: string,
    password: string,
  ): Promise<
    Prisma.UserAuthLocalGetPayload<{
      include: {
        User: {
          select: {
            id: true;
          };
        };
      };
    }>
  > {
    const userAuthLocal = await this.prismaClient.userAuthLocal.findUnique({
      where: {
        username,
      },
      include: {
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!userAuthLocal) throw vendors.httpErrors.Unauthorized('User not found');

    const passwordMatched = await UserLocalService.passwordCompare(
      password,
      userAuthLocal.password,
    );

    if (!passwordMatched) {
      throw new vendors.httpErrors.Unauthorized('Password is incorrect');
    }

    return userAuthLocal;
  }

  public static async passwordHash(password: string): Promise<string> {
    const salt = await genSalt(3);
    const hashed = await hash(password, salt);

    return hashed;
  }

  public static async passwordCompare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const result = await compare(plainPassword, hashedPassword);

    return result;
  }
}
