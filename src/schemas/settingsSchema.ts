import { z } from 'zod'
import { taskPrioritySchema } from './taskSchema'

export const themeModeSchema = z.enum(['light', 'dark', 'system'])

export const userSettingsSchema = z.object({
  theme: themeModeSchema.default('dark'),
  userName: z
    .string()
    .trim()
    .min(1, 'User name cannot be blank')
    .max(50, 'User name cannot exceed 50 characters')
    .default('Alex Developer'),
  userTitle: z
    .string()
    .trim()
    .max(50, 'Title cannot exceed 50 characters')
    .default('Senior Software Engineer'),
  userEmail: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .default('alex.dev@example.com'),
  weeklyTargetHours: z
    .number()
    .min(1, 'Weekly target must be at least 1 hour')
    .max(100, 'Weekly target cannot exceed 100 hours')
    .default(40),
  defaultTaskPriority: taskPrioritySchema.default('medium'),
  compactView: z.boolean().default(false),
  enableSound: z.boolean().default(true),
})
