import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validation/zod';
import Button from '../../../components/ui/Button';
import TextInput from '../../../components/ui/TextInput';
import Alert from '../../../components/ui/Alert';


const LoginForm = ({ onSubmit, loading, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Alert message={error} />
      <TextInput
        id="email"
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextInput
        id="password"
        label="Password"
        type="password"
        placeholder="Enter password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" disabled={!isValid || !isDirty || loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
