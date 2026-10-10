import { z } from 'zod'

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'in_review', 'done'])

export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])

export const createTaskSchema = z.object({
  projectId: z.string().min(1, 'Project selection is required'),
  title: z
    .string()
    .trim()
    .min(2, 'Task title must be at least 2 characters')
    .max(120, 'Task title cannot exceed 120 characters'),
  description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').default(''),
  status: taskStatusSchema.default('todo'),
  priority: taskPrioritySchema.default('medium'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  tags: z.array(z.string().trim()).default([]),
  estimatedHours: z
    .number()
    .min(0, 'Estimated hours must be positive')
    .max(500, 'Estimated hours must be realistic (max 500)')
    .nullable()
    .default(null),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  completedAt: z.string().nullable().optional(),
})

export const taskSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().min(2),
  description: z.string(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().nullable(),
  tags: z.array(z.string()),
  estimatedHours: z.number().nullable(),
})
