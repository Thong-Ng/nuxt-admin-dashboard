import { z } from 'zod'

export const bookingSchema = z.object({
  id: z.number(),
  court_id: z.number(),
  user_id: z.number(),
  start_time: z.string(),
  end_time: z.string(),
  status: z.string(),
  type: z.string(),
  total: z.number(),
})

export type Bookings = z.infer<typeof bookingSchema>
