import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createIncident, getDashboardSnapshot, listAlerts, listPreparedness, listIncidents, updateIncidentStatus, updateAlertStatus } from "./db";

const incidentInput = z.object({ disasterType: z.string().min(2), location: z.string().min(2), severity: z.enum(["moderate", "high", "critical"]), description: z.string().min(10), contactDetails: z.string().max(160).optional() });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const options = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...options, maxAge: -1 }); return { success: true } as const; }),
  }),
  dashboard: router({ snapshot: publicProcedure.query(() => getDashboardSnapshot()), alerts: publicProcedure.query(() => listAlerts()), resources: publicProcedure.query(() => listPreparedness()) }),
  incidents: router({
    list: publicProcedure.query(() => listIncidents()),
    submit: protectedProcedure.input(incidentInput).mutation(({ ctx, input }) => createIncident({ ...input, reporterId: ctx.user.id })),
    updateStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["submitted", "reviewing", "verified", "resolved", "rejected"]) })).mutation(({ ctx, input }) => updateIncidentStatus(input.id, input.status, ctx.user.id)),
  }),
  alerts: router({ updateStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["draft", "published", "resolved"]) })).mutation(({ input, ctx }) => updateAlertStatus(input.id, input.status, ctx.user.id)) }),
});
export type AppRouter = typeof appRouter;
