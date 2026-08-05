import { z } from 'zod';

export const buildingSchema = z.object({
  name: z.string().min(1, 'Building name is required').max(255),
  address_line: z.string().min(1, 'Address is required').max(255),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
  postal_code: z.string().min(1, 'Postal code is required').max(10),
});

export type BuildingFormValues = z.infer<typeof buildingSchema>;
