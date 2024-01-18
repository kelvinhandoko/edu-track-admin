/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { auth } from "firebase-admin";

import { cookies, headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { customInitApp } from "@/config/firebase-admin";
import { api } from "@/trpc/server";

customInitApp();

export async function POST(request: NextRequest) {
  const authorization = headers().get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    const decodedToken = await auth().verifyIdToken(idToken!);

    if (decodedToken) {
      //Generate session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth().createSessionCookie(idToken!, {
        expiresIn,
      });
      const options = {
        name: "session",
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      const res = await request.json();
      //Add the cookie to the browser
      cookies().set(options);
    }
  }

  return NextResponse.json({}, { status: 200 });
}

export async function GET(request: NextRequest) {
  const session = cookies().get("session")?.value ?? "";

  //Validate if the cookie exist in the request
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  //Use Firebase Admin to validate the session cookie
  const decodedClaims = await auth().verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}
