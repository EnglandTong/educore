import type { FastifyPluginAsync } from "fastify";
import mongoose from "mongoose";

import { requireAuth } from "../../middleware/auth.js";
import { requireSchoolAdmin, getAdminSchoolId } from "../../middleware/requireSchoolAdmin.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/errors.js";
import { updateSchoolSchema } from "./school.schema.js";
import { getSchool, updateSchool, listStudents, listTeachers, getSchoolOverview } from "./school.service.js";

export const schoolRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", requireAuth);

  // GET /api/v1/school — get school info
  app.get("/api/v1/school", { preHandler: requireSchoolAdmin() }, async (request, reply) => {
    const schoolId = await getAdminSchoolId(request.user!.id);
    const school = await getSchool(schoolId);
    if (!school) {
      throw new AppError(404, "NOT_FOUND", "School not found.");
    }
    return sendSuccess(reply, request, { school });
  });

  // PUT /api/v1/school — update school info
  app.put("/api/v1/school", { preHandler: requireSchoolAdmin() }, async (request, reply) => {
    const schoolId = await getAdminSchoolId(request.user!.id);
    const body = updateSchoolSchema.parse(request.body);
    const school = await updateSchool(schoolId, body);
    return sendSuccess(reply, request, { school });
  });

  // GET /api/v1/school/students — list students
  app.get("/api/v1/school/students", { preHandler: requireSchoolAdmin() }, async (request, reply) => {
    const schoolId = await getAdminSchoolId(request.user!.id);
    const students = await listStudents(schoolId);
    return sendSuccess(reply, request, { students });
  });

  // GET /api/v1/school/teachers — list teachers
  app.get("/api/v1/school/teachers", { preHandler: requireSchoolAdmin() }, async (request, reply) => {
    const schoolId = await getAdminSchoolId(request.user!.id);
    const teachers = await listTeachers(schoolId);
    return sendSuccess(reply, request, { teachers });
  });

  // GET /api/v1/school/overview — get school overview stats
  app.get("/api/v1/school/overview", { preHandler: requireSchoolAdmin() }, async (request, reply) => {
    const schoolId = await getAdminSchoolId(request.user!.id);
    const overview = await getSchoolOverview(schoolId);
    return sendSuccess(reply, request, { overview });
  });

  // POST /api/v1/school/teachers — add teacher to school
  app.post("/api/v1/school/teachers", { preHandler: requireSchoolAdmin() }, async (request, reply) => {
    const schoolId = await getAdminSchoolId(request.user!.id);
    const body = request.body as { email: string; name: string };
    if (!body.email || !body.name) {
      throw new AppError(400, "VALIDATION_ERROR", "Email and name are required.");
    }

    const { User } = await import("../../models/User.js");
    const existingUser = await User.findOne({ email: body.email }).exec();
    if (!existingUser) {
      throw new AppError(404, "NOT_FOUND", "No user found with this email. Invite flow not yet implemented.");
    }
    // Update existing user's school + role
    existingUser.schoolId = schoolId;
    existingUser.role = "teacher";
    await existingUser.save();

    const school = await (await import("../../models/School.js")).School.findById(schoolId).exec();
    if (school && !school.teacherIds?.some((id) => id.equals(existingUser._id))) {
      school.teacherIds = [...(school.teacherIds ?? []), existingUser._id];
      await school.save();
    }

    const teachers = await listTeachers(schoolId);
    return sendSuccess(reply, request, { teachers }, 201);
  });

  // DELETE /api/v1/school/teachers/:teacherId — remove teacher from school
  app.delete("/api/v1/school/teachers/:teacherId", { preHandler: requireSchoolAdmin() }, async (request, reply) => {
    const schoolId = await getAdminSchoolId(request.user!.id);
    const { teacherId } = request.params as { teacherId: string };

    const { User } = await import("../../models/User.js");
    const teacher = await User.findOne({ _id: new mongoose.Types.ObjectId(teacherId), schoolId: new mongoose.Types.ObjectId(schoolId) }).exec();
    if (!teacher) {
      throw new AppError(404, "NOT_FOUND", "Teacher not found in this school.");
    }

    // Only demote role if currently teacher (preserve admin/other roles)
    if (teacher.role === "teacher") {
      teacher.role = "student";
    }
    teacher.schoolId = undefined;
    await teacher.save();

    // Remove from school.teacherIds
    const { School } = await import("../../models/School.js");
    const school = await School.findById(schoolId).exec();
    if (school?.teacherIds) {
      school.teacherIds = school.teacherIds.filter((id) => !id.equals(teacher._id));
      await school.save();
    }

    const teachers = await listTeachers(schoolId);
    return sendSuccess(reply, request, { teachers });
  });

  // GET /api/v1/school/classes — PLACEHOLDER (see Docs/PLACEHOLDER_ENDPOINTS.md)
  app.get("/api/v1/school/classes", { preHandler: requireSchoolAdmin() }, async (request, reply) => {
    const schoolId = await getAdminSchoolId(request.user!.id);
    // Incomplete: always empty. Not an accepted class-management feature.
    return sendSuccess(reply, request, { classes: [], schoolId });
  });
};
