import { createTRPCRouter } from "@/server/api/trpc";
import lecturerRouter from "./routers/lecturer";
import CategoryRouter from "./routers/Category";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  lecturer: lecturerRouter,
  category: CategoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
