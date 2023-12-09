import { type Cache, caching, Store } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheService } from './cache.service';
import { type PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { hash, genSalt, compare } from 'bcrypt';
import { vendors } from '@jmrl23/express-helper';
import env from 'env-var';
import ms from 'ms';

export class UserService {
  private static instance: UserService;

  private constructor(
    private readonly cacheService: CacheService,
    private readonly prismaClient: PrismaClient,
  ) {}

  public static async createInstance(cache?: Cache): Promise<UserService> {
    const prismaService = PrismaService.getInstance();
    const instance = new UserService(
      await CacheService.createInstance(cache),
      prismaService.getClient(),
    );

    return instance;
  }

  public static async getInstance(): Promise<UserService> {
    if (!UserService.instance) {
      UserService.instance = await UserService.createInstance(
        await caching(
          (await redisStore({
            url: env.get('REDIS_URL').default('redis://').asString(),
            ttl: ms('1m'),
          })) as unknown as Store,
        ),
      );
    }

    return UserService.instance;
  }

  public async getUserById(id: string): Promise<Express.User | null> {
    const cacheKey = `service:user:getUserById(${id})`;
    const cachedUser = await this.cacheService.get<Express.User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.prismaClient.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
      },
    });

    await this.cacheService.set(cacheKey, user);

    return user;
  }

  public async registerUserLocal(
    username: string,
    password: string,
  ): Promise<Express.User | null> {
    const existingUser = await this.prismaClient.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      throw new vendors.httpErrors.Conflict('Username already taken');
    }

    const user = await this.prismaClient.user.create({
      data: {
        username,
        password: await UserService.hashPassword(password),
      },
    });

    return user;
  }

  public static async hashPassword(plain: string): Promise<string> {
    const salt = await genSalt(3);
    const hashedPassword = await hash(plain, salt);

    return hashedPassword;
  }

  public static async comparePassword(
    plain: string,
    hashed: string,
  ): Promise<boolean> {
    const result = await compare(plain, hashed);

    return result;
  }
}
