import { LearningPath } from "../../models/LearningPath.js";
import type { CreatePathInput, SaveGraphInput } from "./learningPath.schema.js";
import { AppError } from "../../utils/errors.js";

function assertTeacherOwnership(path: { teacherId: string }, teacherId: string): void {
  if (path.teacherId !== teacherId) {
    throw new AppError(403, "FORBIDDEN", "This learning path belongs to another teacher.");
  }
}

export async function createLearningPath(teacherId: string, input: CreatePathInput) {
  const path = await LearningPath.create({
    teacherId,
    title: input.title,
    description: input.description ?? "",
    moduleId: input.moduleId ?? "",
    nodes: [],
    edges: [],
    status: "draft",
    assignedClassIds: []
  });
  return path.toObject();
}

export async function getLearningPathById(pathId: string) {
  const path = await LearningPath.findById(pathId).lean().exec();
  return path;
}

export async function listTeacherPaths(teacherId: string) {
  const paths = await LearningPath.find({ teacherId })
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
  return paths;
}

export async function updatePathGraph(
  pathId: string,
  teacherId: string,
  graph: SaveGraphInput
) {
  const path = await LearningPath.findById(pathId).exec();
  if (!path) {
    throw new AppError(404, "NOT_FOUND", "Learning path not found.");
  }
  assertTeacherOwnership(path, teacherId);

  // Validate edges reference existing nodes
  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.sourceNodeId)) {
      throw new AppError(422, "VALIDATION_ERROR", `Edge references unknown source node: ${edge.sourceNodeId}`);
    }
    if (!nodeIds.has(edge.targetNodeId)) {
      throw new AppError(422, "VALIDATION_ERROR", `Edge references unknown target node: ${edge.targetNodeId}`);
    }
  }

  // Detect cycles (DFS-based)
  const visited = new Set<string>();
  const inStack = new Set<string>();
  function hasCycle(nodeId: string): boolean {
    if (inStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);
    inStack.add(nodeId);
    const outgoingEdges = graph.edges.filter((e) => e.sourceNodeId === nodeId);
    for (const edge of outgoingEdges) {
      if (hasCycle(edge.targetNodeId)) return true;
    }
    inStack.delete(nodeId);
    return false;
  }

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) {
        throw new AppError(422, "VALIDATION_ERROR", "The graph contains a cycle. Please remove circular connections.");
      }
    }
  }

  path.nodes = graph.nodes as typeof path.nodes;
  path.edges = graph.edges as typeof path.edges;
  await path.save();
  return path.toObject();
}

export async function publishPath(
  pathId: string,
  teacherId: string,
  assignedClassIds?: string[]
) {
  const path = await LearningPath.findById(pathId).exec();
  if (!path) {
    throw new AppError(404, "NOT_FOUND", "Learning path not found.");
  }
  assertTeacherOwnership(path, teacherId);

  if (path.nodes.length === 0) {
    throw new AppError(422, "VALIDATION_ERROR", "Cannot publish an empty learning path. Add at least one node first.");
  }

  path.status = "published";
  if (assignedClassIds) {
    path.assignedClassIds = assignedClassIds;
  }
  await path.save();
  return path.toObject();
}

export async function archivePath(pathId: string, teacherId: string) {
  const path = await LearningPath.findById(pathId).exec();
  if (!path) {
    throw new AppError(404, "NOT_FOUND", "Learning path not found.");
  }
  assertTeacherOwnership(path, teacherId);
  path.status = "archived";
  await path.save();
  return path.toObject();
}

export async function deletePath(pathId: string, teacherId: string) {
  const path = await LearningPath.findById(pathId).exec();
  if (!path) {
    throw new AppError(404, "NOT_FOUND", "Learning path not found.");
  }
  assertTeacherOwnership(path, teacherId);
  await LearningPath.findByIdAndDelete(pathId).exec();
}

export async function computeDifficultyCurve(pathId: string) {
  const path = await LearningPath.findById(pathId).lean().exec();
  if (!path) {
    throw new AppError(404, "NOT_FOUND", "Learning path not found.");
  }

  // BFS traversal from root nodes (nodes with no incoming edges)
  const incomingEdges = new Map<string, number>();
  for (const edge of path.edges) {
    incomingEdges.set(edge.targetNodeId, (incomingEdges.get(edge.targetNodeId) ?? 0) + 1);
  }

  const rootNodes = path.nodes.filter((n) => !incomingEdges.has(n.id) || incomingEdges.get(n.id) === 0);
  const visited = new Set<string>();
  const result: Array<{ nodeId: string; label: string; difficulty: number; order: number }> = [];
  let order = 0;

  const queue = [...rootNodes];
  for (const node of queue) {
    visited.add(node.id);
  }

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push({
      nodeId: node.id,
      label: node.label,
      difficulty: node.difficulty ?? 50,
      order: order++
    });

    const outgoingEdges = path.edges
      .filter((e) => e.sourceNodeId === node.id)
      .sort((a) => (a.condition?.type === "always" ? -1 : 1));

    for (const edge of outgoingEdges) {
      if (!visited.has(edge.targetNodeId)) {
        visited.add(edge.targetNodeId);
        const targetNode = path.nodes.find((n) => n.id === edge.targetNodeId);
        if (targetNode) {
          queue.push(targetNode);
        }
      }
    }
  }

  return result;
}

export async function previewPathForStudent(
  pathId: string,
  _teacherId: string,
  _studentId: string
) {
  const path = await LearningPath.findById(pathId).lean().exec();
  if (!path) {
    throw new AppError(404, "NOT_FOUND", "Learning path not found.");
  }

  // For now, return all nodes as "available" since we don't have a direct
  // SkillMastery query here. The frontend can compute status from student data.
  const annotations = path.nodes.map((node) => ({
    nodeId: node.id,
    status: "available" as const,
    studentScore: undefined
  }));

  return {
    nodes: path.nodes,
    edges: path.edges,
    annotations
  };
}
