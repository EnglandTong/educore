import { z } from "zod";

export const createDonationSchema = z.object({
  donorName: z.string().min(1).max(100),
  email: z.string().email(),
  amount: z.number().positive(),
  message: z.string().max(500).optional(),
  isPublic: z.boolean().default(false)
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;

export interface DonationInfo {
  mission: string;
  missionDetail: string;
  totalRaised: number;
  totalDonors: number;
  studentsHelped: number;
  schoolsSupported: number;
  fundsBreakdown: { label: string; percentage: number; description: string }[];
}

export interface DonationImpact {
  totalRaised: number;
  totalDonations: number;
  totalDonors: number;
  studentsHelped: number;
  schoolsSupported: number;
  avgDonation: number;
  largestDonation: number;
  recentStories: { name: string; quote: string; role: string }[];
}
