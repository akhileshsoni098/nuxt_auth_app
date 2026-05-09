import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import { handleError, handleErrorCatch } from "../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as IUser;

    if (!body) {
      return handleError(event,400, " Kindly Provide Some Inputs");
    }
    const { name, email, password, age, is_married } = body;

    if (!name || !email || !password) {
      return handleError(event,400, "Name | Email | password  are required fields");
    }

    if (typeof name !== "string" || name.trim().length == 0) {
      return handleError(event,400, "kindly provide valid name ");
    }

    if (typeof email !== "string" || email.trim().length == 0) {
      return handleError(event,400, "kindly provide valid email ");
    }

    if (typeof password !== "string" || password.trim().length == 0) {
      return handleError(event,400, "kindly provide valid password ");
    }

    const check = await User.findOne({ email: email });

    if (check) {
      console.log("calling");
      return handleError(event,400, "Email already exists");
    }

    if (age && (typeof age !== "number" || age < 1)) {
      return handleError(event,400, "Kindly provide valid age");
    }
    if (
      is_married &&
      (typeof is_married !== "boolean" || ![true, false].includes(is_married))
    ) {
      return handleError(event,400, "Kindly provide valid is_married");
    }
    const hashpassword = await bcrypt.hash(password, 10);

    const saveUser = (await User.create({
      name: name,
      email: email,
      age: age,
      is_married: is_married,
      password: hashpassword,
    })) as IUser;

    const data = {
      _id: saveUser._id,
      name: saveUser.name,
      email: saveUser.email,
      age: saveUser.age,
      is_married: saveUser.is_married,
    };

    return {
      success: true,
      user: data,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error(errorMessage)

    return handleErrorCatch(500, errorMessage);
  }
});
