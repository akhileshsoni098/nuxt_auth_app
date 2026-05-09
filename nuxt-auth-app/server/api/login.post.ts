import bcrypt from "bcryptjs";
import User from "../models/User";
import { handleErrorCatch } from "../utils/errorHandler";

import { generateToken } from "../utils/generateToken";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body) {
      return handleError(event, 400, "kindly provide your credentials");
    }

    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return handleError(event, 400, "Email or Password is missing !");
    }

    const check = await User.findOne({ email: email });

    if (!check) {
      return handleError(event, 400, "Email or password is Incorrect");
    }

    const comparePassword = await bcrypt.compare(password, check.password);

    if (!comparePassword) {
      return handleError(event, 400, "Email or password is Incorrect");
    }

    const token = generateToken(check._id.toString());

    return {
      status: true,
      statusCode: 200,
      message: "user logged in success",
      token: token as string,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error(errorMessage);
    return handleErrorCatch(500, errorMessage);
  }
});
