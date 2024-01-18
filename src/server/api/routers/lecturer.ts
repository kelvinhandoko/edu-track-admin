import { type AxiosResponse } from "axios";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
});

export default lecturerRouter;
