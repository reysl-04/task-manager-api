import { z } from "zod"

const listSchema = z.object({
    name: z.string().min(1).max(100)
})

export default listSchema