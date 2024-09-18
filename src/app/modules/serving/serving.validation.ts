import { z } from "zod"

const createServingZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    price: z.string({ required_error: 'Price is required' }),
    price_breakdown: z.string({ required_error: 'Price Breakdown is required' }),
    description: z.string({ required_error: 'description is required' }),
    service: z.string({ required_error: 'service is required' }),
    location: z.string({ required_error: 'Location is required' })
  })
})

const updateServingZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    price: z.number().optional(),
    price_breakdown: z.string().optional(),
    description: z.string().optional(),
    service: z.string().optional(),
    location: z.string().optional()
  }),
})

export const ServingValidation = {
  createServingZodSchema,
  updateServingZodSchema,
}
