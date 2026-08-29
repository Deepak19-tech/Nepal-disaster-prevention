import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const baseReq = { protocol: "https", headers: {} } as TrpcContext["req"];
const baseRes = { clearCookie: () => undefined } as TrpcContext["res"];
const user = { id: 7, openId: "user-7", name: "Reporter", email: "reporter@example.com", loginMethod: "manus", role: "user" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
const admin = { ...user, id: 8, openId: "admin-8", role: "admin" as const };

describe("disaster workflows", () => {
  it("requires authentication before an incident can be submitted", async () => {
    const caller = appRouter.createCaller({ user: undefined, req: baseReq, res: baseRes });
    await expect(caller.incidents.submit({ disasterType: "Flood", location: "Kailali", severity: "high", description: "Water is blocking the main road near the bridge." })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
  it("accepts a verified incident shape for an authenticated user", async () => {
    const caller = appRouter.createCaller({ user, req: baseReq, res: baseRes });
    const result = await caller.incidents.submit({ disasterType: "Landslide", location: "Melamchi", severity: "critical", description: "A slope has collapsed and access is blocked.", contactDetails: "+977 9800000000" });
    expect(result.status).toBe("submitted");
    expect(result.reporterId).toBe(7);
  });
  it("restricts coordination status updates to admins", async () => {
    const userCaller = appRouter.createCaller({ user, req: baseReq, res: baseRes });
    await expect(userCaller.incidents.updateStatus({ id: 1, status: "reviewing" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    const adminCaller = appRouter.createCaller({ user: admin, req: baseReq, res: baseRes });
    const result = await adminCaller.incidents.updateStatus({ id: 1, status: "verified" });
    expect(result.status).toBe("verified");
    expect(result.reviewedBy).toBe(8);
  });
});
