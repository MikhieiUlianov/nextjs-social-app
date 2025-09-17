import { hash, verify } from "@node-rs/argon2";

export const hashPassword = async (password: string) => await hash(password);

export const verifyPassword = async (
  oldPassword: string,
  newPassword: string
) => await verify(oldPassword, newPassword);
