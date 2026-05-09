import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export const getUserFromToken = async (event: unknown) => {
  const config = useRuntimeConfig();

  if (!(event instanceof H3Event)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid internal server event",
    });
  }
  const authHeader = getHeader(event, "authorization");

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (!decoded || typeof decoded !== "object" || !("_id" in decoded)) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token structure",
      });
    }

    const user = await User.findById(decoded._id).select("-password");

    return user;
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error("auth err is :", errorMessage);

    throw createError({
      statusCode: 500,
      statusMessage: `authentication faild ${errorMessage}`,
    });
  }
};
