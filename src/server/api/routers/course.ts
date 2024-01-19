import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { AxiosError, type AxiosResponse } from "axios";
import { TRPCError } from "@trpc/server";

const BASE_PATH = "/course";

const courseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.custom<CoursePayload>())
    .mutation(async ({ ctx, input }) => {
      try {
        const res: AxiosResponse<ApiResponse<Course>> = await ctx.api.post(
          BASE_PATH,
          input,
        );
        return res.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: axiosError.response?.data.message,
          });
        }
      }
    }),
  updateImages: protectedProcedure
    .input(z.custom<Pick<Course, "id" | "backgroundUrl">>())
    .mutation(async ({ ctx, input }) => {
      const res: AxiosResponse<ApiResponse<Course>> = await ctx.api.put(
        `${BASE_PATH}/detail/${input.id}/image`,
        { backgroundUrl: input.backgroundUrl },
      );
      if (res.status !== 200) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: res.data.message,
        });
      }
      return res.data;
    }),
});

export default courseRouter;
