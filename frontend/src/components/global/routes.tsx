import { User } from '@/types/user';
import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/routes/login';
import NotFound from '@/routes/not-found';
import Register from '@/routes/register';
import Content from '@/routes/content';

export const RoutesWithoutUser = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/' element={<Navigate to={'/login'} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export const RoutesWithUser: FC<RoutesWithUserProps> = ({ user }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/' element={<Content user={user} />} />
        <Route path='/login' element={<Navigate to={'/'} />} />
        <Route path='/register' element={<Navigate to={'/'} />} />
      </Routes>
    </BrowserRouter>
  );
};

export interface RoutesWithUserProps {
  user: User;
  refetch: () => void;
}
