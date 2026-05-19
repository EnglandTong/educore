import { z } from "zod";

export const registerVolunteerSchema = z.object({
  expertise: z.array(z.string()).min(1, "Select at least one area of expertise"),
  bio: z.string().max(500).optional()
});

export type RegisterVolunteerInput = z.infer<typeof registerVolunteerSchema>;
