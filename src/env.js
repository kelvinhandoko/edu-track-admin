import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    BASE_API_URL: z.string(),
    FIREBASE_ADMIN_TYPE: z.string(),
    FIREBASE_ADMIN_PROJECT_ID: z.string(),
    FIREBASE_ADMIN_PRIVATE_KEY_ID: z.string(),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string(),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string(),
    FIREBASE_ADMIN_CLIENT_ID: z.string(),
    FIREBASE_ADMIN_AUTH_URI: z.string(),
    FIREBASE_ADMIN_TOKEN_URI: z.string(),
    FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL: z.string(),
    FIREBASE_ADMIN_CLIENT_X509_CERT_URL: z.string(),
    FIREBASE_ADMIN_UNIVERSE_DOMAIN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BASE_API_URL: process.env.BASE_API_URL,
    FIREBASE_ADMIN_TYPE: process.env.FIREBASE_ADMIN_TYPE,
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_PRIVATE_KEY_ID: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_CLIENT_ID: process.env.FIREBASE_ADMIN_CLIENT_ID,
    FIREBASE_ADMIN_AUTH_URI: process.env.FIREBASE_ADMIN_AUTH_URI,
    FIREBASE_ADMIN_TOKEN_URI: process.env.FIREBASE_ADMIN_TOKEN_URI,
    FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL:
      process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    FIREBASE_ADMIN_CLIENT_X509_CERT_URL:
      process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
    FIREBASE_ADMIN_UNIVERSE_DOMAIN: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
