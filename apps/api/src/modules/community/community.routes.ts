import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { assertRole } from "../../services/access.service.js";
import {
  createAnnouncement,
  createConversation,
  listAnnouncementsForUser,
  listConversationsForUser,
  listMessagesForUser,
  markAnnouncementRead,
  sendMessageInConversation
} from "../../services/community.service.js";
import { getCurrentUserProfile } from "../../services/auth.service.js";
import { sendSuccess } from "../../utils/response.js";

const idParams = z.object({ id: z.string().min(1) });
const announcementSchema = z.object({
  schoolId: z.string().optional(),
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(["news", "event", "curriculum", "celebration"]),
  targetAudience: z.enum(["all", "class", "grade"]),
  classIds: z.array(z.string()).optional()
});
const conversationSchema = z.object({
  studentId: z.string().min(1),
  teacherId: z.string().min(1).optional(),
  parentId: z.string().min(1).optional(),
  initialMessage: z.string().min(1).optional()
});
const messageSchema = z.object({
  content: z.string().min(1)
});

export const communityRoutes: FastifyPluginAsync = async (app) => {
  app.get("/announcements", { preHandler: requireAuth }, async (request, reply) => {
    const announcements = await listAnnouncementsForUser(request.user!.id, request.user!.role);
    return sendSuccess(reply, request, { announcements });
  });

  app.post("/announcements", { preHandler: requireAuth, preValidation: validateRequest({ body: announcementSchema }) }, async (request, reply) => {
    assertRole(request.user!, ["teacher", "admin"]);
    const body = request.body as z.infer<typeof announcementSchema>;
    const author = await getCurrentUserProfile(request.user!.id);
    const announcement = await createAnnouncement(
      { id: author.id, name: author.name, role: author.role },
      body
    );
    return sendSuccess(reply, request, { announcement }, 201);
  });

  app.put("/announcements/:id/read", { preHandler: requireAuth, preValidation: validateRequest({ params: idParams }) }, async (request, reply) => {
    const params = request.params as z.infer<typeof idParams>;
    const announcement = await markAnnouncementRead(request.user!.id, params.id);
    return sendSuccess(reply, request, { announcement });
  });

  app.get("/conversations", { preHandler: requireAuth }, async (request, reply) => {
    assertRole(request.user!, ["parent", "teacher"]);
    const conversations = await listConversationsForUser(request.user!.id, request.user!.role);
    return sendSuccess(reply, request, { conversations });
  });

  app.post("/conversations", { preHandler: requireAuth, preValidation: validateRequest({ body: conversationSchema }) }, async (request, reply) => {
    assertRole(request.user!, ["parent", "teacher"]);
    const body = request.body as z.infer<typeof conversationSchema>;
    const author = await getCurrentUserProfile(request.user!.id);
    const conversation = await createConversation(
      { id: author.id, name: author.name, role: author.role },
      body
    );
    return sendSuccess(reply, request, { conversation }, 201);
  });

  app.get("/conversations/:id/messages", { preHandler: requireAuth, preValidation: validateRequest({ params: idParams }) }, async (request, reply) => {
    assertRole(request.user!, ["parent", "teacher"]);
    const params = request.params as z.infer<typeof idParams>;
    const messages = await listMessagesForUser(request.user!.id, request.user!.role, params.id);
    return sendSuccess(reply, request, { messages });
  });

  app.post("/conversations/:id/messages", { preHandler: requireAuth, preValidation: validateRequest({ params: idParams, body: messageSchema }) }, async (request, reply) => {
    assertRole(request.user!, ["parent", "teacher"]);
    const params = request.params as z.infer<typeof idParams>;
    const body = request.body as z.infer<typeof messageSchema>;
    const author = await getCurrentUserProfile(request.user!.id);
    const message = await sendMessageInConversation(
      { id: author.id, name: author.name, role: author.role },
      params.id,
      body
    );
    return sendSuccess(reply, request, { message }, 201);
  });
};
