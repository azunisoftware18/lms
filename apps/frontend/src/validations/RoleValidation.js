import * as z from 'zod';

export const roleSchema = z.object({
  name: z.string()
    .min(1, 'Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must not exceed 50 characters'),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  password: z.string()
    .optional()
    .refine((val) => {
      // Password is optional for editing, but if provided must meet criteria
      if (!val) return true;
      return val.length >= 6;
    }, 'Password must be at least 6 characters'),
  
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  
  permissions: z.record(z.boolean())
    .refine((perms) => {
      // At least one permission must be selected
      return Object.values(perms).some(value => value === true);
    }, 'At least one permission must be selected'),
});

// For login form (if needed separately)
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// For role update (password optional)
export const roleUpdateSchema = roleSchema.extend({
  password: z.string().optional(),
});

export const moduleIcons = {
  dashboard: 'BarChart2',
  customers: 'Users',
  loans: 'CreditCard',
  payments: 'FileText',
  reports: 'BarChart2',
  settings: 'Settings',
  adminManagement: 'Lock',
  users: 'Users',
  leads: 'Users',
  'loan-applications': 'FileText',
  'loan-accounts': 'CreditCard',
  nach: 'FileText',
  branch: 'Building2',
};