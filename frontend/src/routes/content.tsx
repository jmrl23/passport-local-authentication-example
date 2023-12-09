import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/utils';
import { User } from '@/types/user';
import { useNavigate } from 'react-router-dom';

export default function Content(props: Props) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const data = await apiRequest<{ success: boolean }>(
      fetch('/api/user/logout'),
    );

    if (data instanceof Error) {
      alert(data.message);

      return;
    }

    if (data.success) {
      navigate(0);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='font-extrabold'>
        Hi there, <span className='underline'>{props.user.username}</span>!
      </h1>
      <Button className='mt-4' onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export interface Props {
  user: User;
}
