import { ADMIN_COOKIE_NAME, getAdminPassword, getAdminSessionToken } from "lib/admin-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const expectedPassword = getAdminPassword();
  const sessionToken = getAdminSessionToken();

  if (!expectedPassword || !sessionToken) {
    return NextResponse.json(
      { error: "Config de admin incompleta. Define ADMIN_PASSWORD y ADMIN_SESSION_TOKEN en .env" },
      { status: 500 },
    );
  }

  try {
    const body = (await req.json()) as { password?: string };

    if (!body.password || body.password !== expectedPassword) {
      return NextResponse.json({ error: "Contrasena incorrecta" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "No se pudo iniciar sesion" }, { status: 400 });
  }
}
