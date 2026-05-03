import { z } from 'zod'

export const createTaskSchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().min(1).max(100),
    dueDate: z.iso.datetime()
})

export const updateTaskSchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().min(1).max(100),
    status: z.enum(['pending', 'done']),
    dueDate: z.iso.datetime()
}).partial()
