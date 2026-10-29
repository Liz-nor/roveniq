import { z } from 'zod';

export const nameSchema = z
  .string()
  .regex(/^\w+$/, 'Letters, numbers and underscores only')
  .min(2);
export const emailSchema = z
  .string()
  .email()
  .regex(/@stud\.noroff\.no$/, 'Must be a stud.noroff.no email');
export const passwordSchema = z.string().min(8);
