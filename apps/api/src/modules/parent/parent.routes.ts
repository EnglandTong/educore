import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { assertRole } from "../../services/access.service.js";
import {
  getChildActivity,
  getChildProgress,
  getSubjectGuide,
  linkChildByInviteCode,
  listLinkedChildren,
  updateGuardianConsent
} from "../../services/parent.service.js";
import { sendSuccess } from "../../utils/response.js";

const childParams = z.object({ id: z.string().min(1) });
const guideParams = z.object({ moduleId: z.string().min(1), skillId: z.string().min(1) });
const linkSchema = z.object({
  inviteCode: z.string().min(1),
  relationship: z.string().min(1)
});
const consentSchema = z.object({
  consentGiven: z.boolean()
});

export const parentRoutes: FastifyPluginAsync = async (app) => {
  app.get("/children", { preHandler: requireAuth }, async (request, reply) => {
    assertRole(request.user!, ["parent"]);
    const children = await listLinkedChildren(request.user!.id);
    return sendSuccess(reply, request, { children });
  });

  app.post("/links", { preHandler: requireAuth, preValidation: validateRequest({ body: linkSchema }) }, async (request, reply) => {
    assertRole(request.user!, ["parent"]);
    const body = request.body as z.infer<typeof linkSchema>;
    const link = await linkChildByInviteCode(request.user!.id, body.inviteCode, body.relationship);
    return sendSuccess(reply, request, { link }, 201);
  });

  app.put("/children/:id/consent", { preHandler: requireAuth, preValidation: validateRequest({ params: childParams, body: consentSchema }) }, async (request, reply) => {
    assertRole(request.user!, ["parent"]);
    const params = request.params as z.infer<typeof childParams>;
    const body = request.body as z.infer<typeof consentSchema>;
    const link = await updateGuardianConsent(request.user!.id, params.id, body.consentGiven);
    return sendSuccess(reply, request, { link });
  });

  app.get("/children/:id/progress", { preHandler: requireAuth, preValidation: validateRequest({ params: childParams }) }, async (request, reply) => {
    assertRole(request.user!, ["parent"]);
    const params = request.params as z.infer<typeof childParams>;
    const progress = await getChildProgress(request.user!.id, params.id);
    return sendSuccess(reply, request, { progress });
  });

  app.get("/children/:id/activity", { preHandler: requireAuth, preValidation: validateRequest({ params: childParams }) }, async (request, reply) => {
    assertRole(request.user!, ["parent"]);
    const params = request.params as z.infer<typeof childParams>;
    const activity = await getChildActivity(request.user!.id, params.id);
    return sendSuccess(reply, request, { activity });
  });

  app.get("/guides/:moduleId/:skillId", { preHandler: requireAuth, preValidation: validateRequest({ params: guideParams }) }, async (request, reply) => {
    assertRole(request.user!, ["parent"]);
    const params = request.params as z.infer<typeof guideParams>;
    const guide = await getSubjectGuide(request.user!.id, params.moduleId, params.skillId);
    return sendSuccess(reply, request, { guide });
  });
};
