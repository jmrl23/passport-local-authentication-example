import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/utils';
import { User } from '@/types/user';

export default function Content(props: Props) {
  return (
    <div className='p-4'>
      <h1 className='font-extrabold'>
        Hi there,{' '}
        <span className='underline'>{props.user.UserAuthLocal?.username}</span>!
      </h1>
      <LogoutButton refetch={props.refetch} />
    </div>
  );
}

function LogoutButton(props: { refetch: () => void }) {
  const handleLogout = async () => {
    const data = await apiRequest<{ success: boolean }>(
      fetch('/api/user/logout', {
        credentials: 'include',
      }),
    );

    if (data instanceof Error) {
      alert(data.message);

      return;
    }

    if (data.success) {
      props.refetch();
    }
  };

  return (
    <Button className='mt-4' onClick={handleLogout}>
      Logout
    </Button>
  );
}

export interface Props {
  user: User;
  refetch: () => void;
}
