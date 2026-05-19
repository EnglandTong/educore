import type { FastifyPluginAsync } from "fastify";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { assertRole } from "../../services/access.service.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/errors.js";
import {
  createPathSchema,
  saveGraphSchema,
  publishPathSchema,
  pathIdParam
} from "./learningPath.schema.js";
import {
  createLearningPath,
  getLearningPathById,
  listTeacherPaths,
  updatePathGraph,
  publishPath,
  archivePath,
  deletePath,
  computeDifficultyCurve,
  previewPathForStudent
} from "./learningPath.service.js";

export const learningPathRoutes: FastifyPluginAsync = async (app) => {
  // POST /api/v1/teacher/learning-paths — create new path
  app.post(
    "/api/v1/teacher/learning-paths",
    { preHandler: requireAuth, preValidation: validateRequest({ body: createPathSchema }) },
    async (request, reply) => {
      assertRole(request.user!, ["teacher", "admin"]);
      const body = createPathSchema.parse(request.body);
      const path = await createLearningPath(request.user!.id, body);
      return sendSuccess(reply, request, {
        path: {
          id: String(path._id),
          teacherId: path.teacherId,
          title: path.title,
          description: path.description,
          moduleId: path.moduleId,
          nodes: path.nodes,
          edges: path.edges,
          status: path.status,
          assignedClassIds: path.assignedClassIds,
          createdAt: path.createdAt,
          updatedAt: path.updatedAt
        }
      }, 201);
    }
  );

  // GET /api/v1/teacher/learning-paths — list teacher's paths
  app.get(
    "/api/v1/teacher/learning-paths",
    { preHandler: requireAuth },
    async (request, reply) => {
      assertRole(request.user!, ["teacher", "admin"]);
      const paths = await listTeacherPaths(request.user!.id);
      return sendSuccess(reply, request, {
        paths: paths.map((p) => ({
          id: String(p._id),
          teacherId: p.teacherId,
          title: p.title,
          description: p.description,
          moduleId: p.moduleId,
          nodeCount: p.nodes.length,
          edgeCount: p.edges.length,
          status: p.status,
          assignedClassIds: p.assignedClassIds,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }))
      });
    }
  );

  // GET /api/v1/teacher/learning-paths/:id — get single path
  app.get(
    "/api/v1/teacher/learning-paths/:id",
    { preHandler: requireAuth, preValidation: validateRequest({ params: pathIdParam }) },
    async (request, reply) => {
      assertRole(request.user!, ["teacher", "admin"]);
      const { id } = request.params as { id: string };
      const path = await getLearningPathById(id);
      if (!path) {
        throw new AppError(404, "NOT_FOUND", "Learning path not found.");
      }
      return sendSuccess(reply, request, {
        path: {
          id: String(path._id),
          teacherId: path.teacherId,
          title: path.title,
          description: path.description,
          moduleId: path.moduleId,
          nodes: path.nodes,
          edges: path.edges,
          status: path.status,
          assignedClassIds: path.assignedClassIds,
          createdAt: path.createdAt,
          updatedAt: path.updatedAt
        }
      });
    }
  );

  // PUT /api/v1/teacher/learning-paths/:id/graph — save nodes & edges
  app.put(
    "/api/v1/teacher/learning-paths/:id/graph",
    { preHandler: requireAuth, preValidation: validateRequest({ params: pathIdParam, body: saveGraphSchema }) },
    async (request, reply) => {
      assertRole(request.user!, ["teacher", "admin"]);
      const { id } = request.params as { id: string };
      const body = saveGraphSchema.parse(request.body);
      const path = await updatePathGraph(id, request.user!.id, body);
      return sendSuccess(reply, request, {
        path: {
          id: String(path._id),
          nodes: path.nodes,
          edges: path.edges,
          updatedAt: path.updatedAt
        }
      });
    }
  );

  // GET /api/v1/teacher/learning-paths/:id/difficulty-curve
  app.get(
    "/api/v1/teacher/learning-paths/:id/difficulty-curve",
    { preHandler: requireAuth, preValidation: validateRequest({ params: pathIdParam }) },
    async (request, reply) => {
      assertRole(request.user!, ["teacher", "admin"]);
      const { id } = request.params as { id: string };
      const curve = await computeDifficultyCurve(id);
      return sendSuccess(reply, request, { curve });
    }
  );

  // GET /api/v1/teacher/learning-paths/:id/preview/:studentId
  app.get(
    "/api/v1/teacher/learning-paths/:id/preview/:studentId",
    { preHandler: requireAuth, preValidation: validateRequest({ params: pathIdParam }) },
    async (request, reply) => {
      assertRole(request.user!, ["teacher", "admin"]);
      const { id, studentId } = request.params as { id: string; studentId: string };
      const preview = await previewPathForStudent(id, request.user!.id, studentId);
      return sendSuccess(reply, request, { preview });
    }
  );

  // POST /api/v1/teacher/learning-paths/:id/publish
  app.post(
    "/api/v1/teacher/learning-paths/:id/publish",
    { preHandler: requireAuth, preValidation: validateRequest({ params: pathIdParam, body: publishPathSchema }) },
    async (request, reply) => {
      assertRole(request.user!, ["teacher", "admin"]);
      const { id } = request.params as { id: string };
      const body = publishPathSchema.parse(request.body);
      const path = await publishPath(id, request.user!.id, body.assignedClassIds);
      return sendSuccess(reply, request, {
        path: {
          id: String(path._id),
          status: path.status,
          assignedClassIds: path.assignedClassIds
        }
      });
    }
  );

  // POST /api/v1/teacher/learning-paths/:id/archive
  app.post(
    "/api/v1/teacher/learning-paths/:id/archive",
    { preHandler: requireAuth, preValidation: validateRequest({ params: pathIdParam }) },
    async (request, reply) => {
      assertRole(request.user!, ["teacher", "admin"]);
      const { id } = request.params as { id: string };
      const path = await archivePath(id, request.user!.id);
      return sendSuccess(reply, request, {
        path: { id: String(path._id), status: path.status }
      });
    }
  );

  // DELETE /api/v1/teacher/learning-paths/:id
  app.delete(
    "/api/v1/teacher/learning-paths/:id",
    { preHandler: requireAuth, preValidation: validateRequest({ params: pathIdParam }) },
    async (request, reply) => {
      assertRole(request.user!, ["teacher", "admin"]);
      const { id } = request.params as { id: string };
      await deletePath(id, request.user!.id);
      return sendSuccess(reply, request, { deleted: true });
    }
  );
};
