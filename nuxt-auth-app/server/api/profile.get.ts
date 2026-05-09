
import { IUser } from "../models/User";
import { ApiResponse } from "../types";

import { getUserFromToken } from "../utils/auth";

export default defineEventHandler(async (event): Promise<ApiResponse<Partial<IUser>>> => {
try {
    const user = await getUserFromToken(event) as IUser;

    return {
      status: true,
      statusCode: 200,
      message: "user profile",
      data: user,
    };
  } catch (err: unknown) {
    const errorWithStatus = err as { statusCode?: number };
    if (errorWithStatus.statusCode && errorWithStatus.statusCode < 500) {
      throw err; 
    }
    return handleErrorCatch(500, "Profile fetch failed");
  }
});
