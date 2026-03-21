export const ADMIN_COOKIE_NAME = "admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

export function getAdminSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN || "";
}

export function isAdminSessionValid(sessionToken: string | undefined): boolean {
  const expected = getAdminSessionToken();
  if (!expected) return false;
  return sessionToken === expected;
}
