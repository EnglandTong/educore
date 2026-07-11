export type GuidanceType = "school-info" | "major-info" | "career-path" | "admission-requirement" | "campus-life";
export interface SchoolMajorInfo {
  id: string;
  type: GuidanceType;
  name: string;
  description: string;
  location?: string;
  website?: string;
  admissionRequirements?: string[];
  programs?: string[];
  careerOutcomes?: string[];
  realExperienceStories?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
export interface GuidanceRecommendation {
  id: string;
  studentId: string;
  recommendedItems: Array<{ itemId: string; reason: string; priority: "high" | "medium" | "low"; }>;
  basedOn: string[];
  consentGiven: boolean;
  createdAt: string;
}
