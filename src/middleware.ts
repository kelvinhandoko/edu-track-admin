import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./trpc/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  //Return to /login if don't have a session
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //Call the authentication endpoint
  const responseAPI = await fetch(`${request.nextUrl.origin}/api/login`, {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  });

  // Return to /login if token is not authorized
  if (responseAPI.status !== 200) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const checkIsLecturerResponse = await fetch(
    `${request.nextUrl.origin}/api/lecturer`,
    {
      headers: {
        Cookie: `session=${session?.value}`,
      },
    },
  );
  if (checkIsLecturerResponse.status !== 200) {
    return NextResponse.redirect(new URL("/create", request.url));
  }

  return NextResponse.next();
}

//Add your protected routes
export const config = {
  matcher: ["/setting/:path*", "/"],
};
