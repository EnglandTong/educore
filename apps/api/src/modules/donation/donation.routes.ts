import type { FastifyPluginAsync } from "fastify";

import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/errors.js";
import { createDonationSchema } from "./donation.schema.js";
import {
  createDonation,
  listDonations,
  getDonationById,
  getDonationInfo,
  getDonationImpact
} from "./donation.service.js";

export const donationRoutes: FastifyPluginAsync = async (app) => {
  // POST /api/v1/donation/donate — create a donation (public endpoint)
  app.post("/api/v1/donation/donate", async (request, reply) => {
    const body = createDonationSchema.parse(request.body);
    const donation = await createDonation(body);
    return sendSuccess(reply, request, {
      donation: {
        id: String(donation._id),
        donorName: donation.isPublic ? donation.donorName : "Anonymous",
        amount: donation.amount,
        message: donation.message,
        isPublic: donation.isPublic,
        status: donation.status,
        completedAt: donation.completedAt,
        createdAt: donation.createdAt
      }
    }, 201);
  });

  // GET /api/v1/donation/info — get project info and fundraising summary
  app.get("/api/v1/donation/info", async (request, reply) => {
    const info = await getDonationInfo();
    return sendSuccess(reply, request, { info });
  });

  // GET /api/v1/donation/impact — get impact metrics and stories
  app.get("/api/v1/donation/impact", async (request, reply) => {
    const impact = await getDonationImpact();
    return sendSuccess(reply, request, { impact });
  });

  // GET /api/v1/donation/list — list public donations
  app.get("/api/v1/donation/list", async (request, reply) => {
    const donations = await listDonations();
    return sendSuccess(reply, request, {
      donations: donations.map((d) => ({
        id: String(d._id),
        donorName: d.donorName,
        amount: d.amount,
        message: d.message,
        completedAt: d.completedAt
      }))
    });
  });

  // GET /api/v1/donation/:id — get donation details
  app.get("/api/v1/donation/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const donation = await getDonationById(id);
    if (!donation) {
      throw new AppError(404, "NOT_FOUND", "Donation not found.");
    }
    return sendSuccess(reply, request, { donation });
  });
};
