import { z } from "zod";

export const updateSchoolSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional(),
  contactPhone: z.string().max(20).optional(),
  settings: z.record(z.unknown()).optional()
});

export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;
