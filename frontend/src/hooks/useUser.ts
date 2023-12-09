import { apiRequest } from '@/lib/utils';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export default function useUser() {
  const fetcher = async () => {
    const data = await apiRequest<{ user: User | null }>(
      fetch('/api/user/session', { credentials: 'include' }),
    );

    if (data instanceof Error) return null;

    const user = data.user;

    return user;
  };

  const result = useQuery<User | null>({
    queryFn: fetcher,
    queryKey: ['user', 'session'],
  });

  return result;
}
