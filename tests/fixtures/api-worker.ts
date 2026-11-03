import { onRequest } from "../../functions/_middleware";
import { onRequestPost as resolve } from "../../functions/api/invitations/resolve";
import { onRequestPut as rsvp } from "../../functions/api/rsvp";
import { onRequestGet as list, onRequestPost as wish } from "../../functions/api/wishes";
import type { Env } from "../../functions/_lib/core";
const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const path = new URL(request.url).pathname;
    const handler = path === "/api/invitations/resolve" ? resolve : path === "/api/rsvp" ? rsvp : request.method === "POST" ? wish : list;
    const context = { request, env, waitUntil: ctx.waitUntil.bind(ctx), next: () => handler(context as unknown as Parameters<typeof handler>[0]) };
    return onRequest(context as unknown as Parameters<typeof onRequest>[0]);
  },
};
export default worker;
