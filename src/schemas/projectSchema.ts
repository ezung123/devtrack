import { z } from 'zod'

export const projectStatusSchema = z.enum([
  'planning',
  'active',
  'on_hold',
  'completed',
  'cancelled',
])

export const projectPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])

export const createProjectBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Project name must be at least 2 characters')
    .max(100, 'Project name cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .default(''),
  status: projectStatusSchema.default('active'),
  priority: projectPrioritySchema.default('medium'),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be in YYYY-MM-DD format'),
  color: z.string().default('#4f69f2'),
  tags: z.array(z.string().trim()).default([]),
})

export const createProjectSchema = createProjectBaseSchema.refine(
  (data) => {
    if (!data.startDate || !data.deadline) return true
    return new Date(data.deadline).getTime() >= new Date(data.startDate).getTime()
  },
  {
    message: 'Deadline cannot be before the start date',
    path: ['deadline'],
  }
)

export const updateProjectSchema = createProjectBaseSchema.partial()

export const projectSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(2),
  description: z.string(),
  status: projectStatusSchema,
  priority: projectPrioritySchema,
  startDate: z.string(),
  deadline: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  color: z.string(),
  tags: z.array(z.string()),
})
