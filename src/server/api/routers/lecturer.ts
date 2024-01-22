import { AxiosError, type AxiosResponse } from "axios";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type Course } from "@/type/Course";
import { type Lecturer, type LecturerPayload } from "@/type/Lecturer";

const BASE_PATH = "/lecturer";

const lecturerRouter = createTRPCRouter({
  find: protectedProcedure.query(async ({ ctx }) => {
    const res: AxiosResponse<ApiResponse<Lecturer>> = await ctx.api.get(
      `${BASE_PATH}/detail`,
    );
    return res.data.data;
  }),
  getCourses: protectedProcedure.query(async ({ ctx }) => {
    const res: AxiosResponse<ApiResponse<Course[]>> = await ctx.api.get(
      `${BASE_PATH}/courses`,
    );
    return res.data.data;
  }),
  create: protectedProcedure
    .input(z.custom<LecturerPayload>())
    .mutation(async ({ ctx, input }) => {
      try {
        const res: AxiosResponse<ApiResponse<Lecturer>> = await ctx.api.post(
          `${BASE_PATH}`,
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

  update: protectedProcedure
    .input(z.custom<LecturerPayload>())
    .mutation(async ({ ctx, input }) => {
      try {
        const res: AxiosResponse<ApiResponse<Lecturer>> = await ctx.api.put(
          `${BASE_PATH}`,
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
});

export default lecturerRouter;
