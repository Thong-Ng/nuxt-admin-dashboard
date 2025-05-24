import { z } from 'zod'
export const courtSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.string(),
  phone: z.string(),
})

export type Users = z.infer<typeof courtSchema>
