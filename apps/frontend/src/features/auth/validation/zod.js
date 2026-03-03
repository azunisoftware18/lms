import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export { loginSchema };