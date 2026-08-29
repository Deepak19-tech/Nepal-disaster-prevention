import { notifyOwner } from "./_core/notification";

export type NotificationEvent = { title: string; body: string; kind: "urgent_alert" | "incident_status" };

export async function publishOperationalNotification(event: NotificationEvent) {
  // The project can persist user-scoped notifications through the notifications table;
  // this owner-facing channel is also useful for escalation until recipient subscriptions are configured.
  return notifyOwner({ title: event.title, content: event.body });
}
