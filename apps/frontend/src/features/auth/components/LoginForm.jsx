import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import TextInput from '../../../components/ui/TextInput';
import Alert from '../../../components/ui/Alert';

const validate = ({ email, password }) => {
  const nextErrors = {};

  if (!email?.trim()) {
    nextErrors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    nextErrors.email = 'Enter a valid email';
  }

  if (!password?.trim()) {
    nextErrors.password = 'Password is required';
  }

  return nextErrors;
};

const LoginForm = ({ onSubmit, loading, error }) => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const canSubmit = useMemo(() => {
    return values.email.trim() && values.password.trim() && !loading;
  }, [values, loading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Alert message={error} />
      <TextInput
        id="email"
        name="email"
        label="Email"
        type="email"
        value={values.email}
        onChange={handleChange}
        placeholder="admin@gmail.com"
        error={fieldErrors.email}
      />
      <TextInput
        id="password"
        name="password"
        label="Password"
        type="password"
        value={values.password}
        onChange={handleChange}
        placeholder="Enter password"
        error={fieldErrors.password}
      />
      <Button type="submit" disabled={!canSubmit}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
