import useUser from '@/hooks/useUser';
import { RoutesWithoutUser, RoutesWithUser } from './components/global/routes';

export default function App() {
  const { data: user, isLoading: loading, refetch } = useUser();

  if (loading) {
    return null;
  }

  if (!user) {
    return <RoutesWithoutUser refetch={refetch} />;
  }

  return <RoutesWithUser user={user} refetch={refetch} />;
}
