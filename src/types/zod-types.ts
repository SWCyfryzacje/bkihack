import { z } from 'zod';
import {
  CATEGORIES,
  SCOPES,
  type CategoryValue,
  type ScopeValue,
} from '@/types/type';
import { PASSWORD_RULES } from '@/constants/password-rules';

// .map() loses the tuple type, so we cast to a non-empty tuple of the *union* (not string)
const categoryValues = CATEGORIES.map((c) => c.value) as [
  CategoryValue,
  ...CategoryValue[],
];
const scopeValues = SCOPES.map((s) => s.value) as [ScopeValue, ...ScopeValue[]];

export const ReportFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Use at least 5 characters')
    .max(80, 'Keep it under 80 characters'),
  description: z
    .string()
    .trim()
    .min(20, 'Describe the problem in at least 20 characters')
    .max(1000, 'Keep it under 1000 characters'),
  category: z.enum(categoryValues, { message: 'Pick a category' }),
  scope: z.enum(scopeValues, { message: 'Pick the scope' }),
  // keep in sync with DURATIONS
  isAnonymous: z.boolean(),
});

export type ReportFormData = z.infer<typeof ReportFormSchema>;

export const SignFormSchema = z.object({
  email: z.email('Invalid e-mail'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Przy rejestracji obowiązuje polityka haseł Clerka (lista wymagań pod polem hasła)
export const SignUpFormSchema = SignFormSchema.extend({
  password: z
    .string()
    .refine(
      (password) => PASSWORD_RULES.every((rule) => rule.test(password)),
      'Hasło nie spełnia wymagań'
    ),
});

export const VerifyCodeSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits long'),
});

export type SignFormData = z.infer<typeof SignFormSchema>;
export type VerifyCodeData = z.infer<typeof VerifyCodeSchema>;
