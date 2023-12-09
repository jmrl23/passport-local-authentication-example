import { type SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { apiRequest, cn } from '@/lib/utils';

export default function Login(props: { refetch: () => void }) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    if (isProcessing) {
      alert('Processing..');

      return;
    }

    setIsProcessing(true);

    const data = await apiRequest(
      fetch('/api/user/authentication/local', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }),
    );

    setIsProcessing(false);

    if (data instanceof Error) {
      alert(data.message);

      return;
    }

    props.refetch();
  };

  return (
    <div className='min-h-screen flex flex-col justify-center'>
      <main className='w-full'>
        <div className='px-4'>
          <Form {...form}>
            <form
              className='max-w-[500px] mx-auto p-4 rounded-lg shadow'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <h1 className='font-extrabold text-3xl mb-4'>Login</h1>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        title='Username'
                        autoComplete='off'
                        disabled={isProcessing}
                      />
                    </FormControl>
                    <FormDescription />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='password'
                        title='Password'
                        autoComplete='off'
                        disabled={isProcessing}
                      />
                    </FormControl>
                    <FormDescription />
                  </FormItem>
                )}
              />
              <div className='flex justify-between'>
                <Link to='/register'>
                  <Button
                    variant='link'
                    type='button'
                    role='button'
                    title='Register'
                    className='pl-0'
                  >
                    Don't have an account?
                  </Button>
                </Link>
                <Button
                  className={cn('inline-flex gap-x-2', isProcessing && 'pl-3')}
                  type='submit'
                  title='Submit'
                  disabled={isProcessing}
                >
                  {isProcessing && <Loader2 className='animate-spin w-4 h-4' />}
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

interface FormValues extends z.infer<typeof formSchema> {}
