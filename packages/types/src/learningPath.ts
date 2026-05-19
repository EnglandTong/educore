export type PathNodeType = "module" | "skill" | "condition" | "review" | "challenge";

export interface BranchCondition {
  skillId: string;
  operator: "gte" | "lt" | "eq";
  thresholdScore: number;
  targetNodeId: string;
}

export interface PathNode {
  id: string;
  type: PathNodeType;
  moduleId?: string;
  skillId?: string;
  label: string;
  positionX: number;
  positionY: number;
  difficulty?: number;
  branches: BranchCondition[];
}

export interface PathEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  condition?: {
    type: "always" | "score_above" | "score_below";
    threshold?: number;
  };
}

export type LearningPathStatus = "draft" | "published" | "archived";

export interface LearningPathDocument {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  moduleId: string;
  nodes: PathNode[];
  edges: PathEdge[];
  status: LearningPathStatus;
  assignedClassIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DifficultyCurvePoint {
  nodeId: string;
  label: string;
  difficulty: number;
  order: number;
}

export interface PreviewNodeAnnotation {
  nodeId: string;
  status: "locked" | "available" | "in_progress" | "completed" | "mastered";
  studentScore?: number;
}
