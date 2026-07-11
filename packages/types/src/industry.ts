export type IndustryContentStatus = "draft" | "pending-review" | "approved" | "published" | "archived" | "rejected";
export type IndustryContentType = "article" | "video" | "interview" | "case-study" | "virtual-tour" | "infographic";
export interface IndustryContent {
  id: string;
  title: string;
  contentType: IndustryContentType;
  industry: string;
  description: string;
  contentUrl?: string;
  sourceAttribution: string;
  reviewStatus: IndustryContentStatus;
  reviewedBy?: string;
  tags: string[];
  targetGradeLevels?: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
export interface IndustryRoleProfile {
  id: string;
  industry: string;
  roleName: string;
  description: string;
  requiredSkills: string[];
  careerPath: string[];
  dayInLife?: string;
}
