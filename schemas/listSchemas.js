import { z } from "zod"

export const listSchema = z.object({
    name: z.string().min(1).max(100)
})