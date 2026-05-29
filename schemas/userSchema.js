import { z } from "zod"

export const createUserSchema = z.object({
    name: z.string().min(1).max(25),
    email: z.email().endsWith('@gmail.com'),
    password: z.string().min(8).max(72)
})
.strict()

export const updateUserSchema = z.object({
    name: z.string().min(1).max(25),
    email: z.email().endsWith('@gmail.com'),
})
.strict()
.partial()
.refine(data => Object.keys(data).length > 0, {
    message: "At least one field is required"
})