import { type AxiosResponse } from "axios";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const BASE_PATH = "/category";

const CategoryRouter = createTRPCRouter({
  findMany: protectedProcedure.query(async ({ ctx }) => {
    const res: AxiosResponse<ApiResponse<Category[]>> = await ctx.api.get(
      `${BASE_PATH}`,
    );
    return res.data.data;
  }),
});

export default CategoryRouter;
