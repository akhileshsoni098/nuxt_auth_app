import User from "../models/User";
import { handleErrorCatch } from "../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {





    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error(errorMessage);
    return handleErrorCatch(500, errorMessage);
  }
});
