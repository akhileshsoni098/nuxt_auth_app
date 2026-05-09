import jwt from "jsonwebtoken";

export const generateToken = (id: string) => {
  const config = useRuntimeConfig();
  return jwt.sign({ _id: id }, config.jwtSecret);
};
