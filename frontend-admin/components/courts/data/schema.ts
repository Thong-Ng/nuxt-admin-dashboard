import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const courtSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  label: z.string(),
  type: z.string(),
  parent_id: z.number(),
})

export type Courts = z.infer<typeof courtSchema>
