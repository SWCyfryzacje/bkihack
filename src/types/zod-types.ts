import { z } from 'zod';
import { FormFeatures } from '@/constants/form-features';

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
  category: z.enum(FormFeatures.map((c) => c.value) as [string, ...string[]], {
    message: 'Pick a category',
  }),
  isAnonymous: z.boolean(),
});

export type ReportFormData = z.infer<typeof ReportFormSchema>;
