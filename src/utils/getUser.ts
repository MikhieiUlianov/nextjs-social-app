import { verifyAuth } from "@/lib/auth";

export const getUser = async () => {
  const verified = await verifyAuth();
  return verified;
};
