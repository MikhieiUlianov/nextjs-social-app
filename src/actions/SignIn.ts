"use server";

import { createSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/hash";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export type SignInDataType = {
  email: string;
  password: string;
};

export const SignInAction = async (
  formData: SignInDataType
): Promise<{ success: boolean; errors?: Record<string, string> }> => {
  const { email, password } = formData;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      success: false,
      errors: {},
    };
  }

  const verifiedPassword = await verifyPassword(user.password, password);

  if (!verifiedPassword) {
    return {
      success: false,
      errors: {
        password: "Invalid password entered.",
      },
    };
  }

  await createSession(user.id);

  redirect("/");
};
