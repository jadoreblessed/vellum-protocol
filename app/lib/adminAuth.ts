import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "vellum-admin-session";

function adminPassword() {
  return process.env.VELLUM_ADMIN_PASSWORD ?? "";
}

function safeEqual(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

export function isAdminPassword(candidate: string) {
  const configuredPassword = adminPassword();
  return Boolean(configuredPassword) && safeEqual(candidate, configuredPassword);
}

export function adminSessionToken() {
  const configuredPassword = adminPassword();
  if (!configuredPassword) return "";
  return createHmac("sha256", configuredPassword)
    .update("vellum-admin-session:v1")
    .digest("hex");
}

export function isAdminSession(candidate?: string) {
  const expectedToken = adminSessionToken();
  return Boolean(candidate && expectedToken) && safeEqual(candidate ?? "", expectedToken);
}
