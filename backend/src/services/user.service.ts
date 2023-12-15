import { type Cache, caching, Store } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheService } from './cache.service';
import { type PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';
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
    const cache = await this.cacheService.get<Express.User>(cacheKey);

    if (cache) return cache;

    const user = await this.prismaClient.user.findUnique({
      where: {
        id,
      },
      include: {
        UserAuthLocal: {
          select: {
            username: true,
          },
        },
        UserInformation: true,
      },
    });

    await this.cacheService.set(cacheKey, user);

    return user;
  }
}
