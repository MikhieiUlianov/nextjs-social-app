"use server";

import { hashPassword, verifyPassword } from "@/lib/hash";
import { prisma } from "@/prisma";

export type ChangePasswordDataType = {
  email: string;
  oldPassword: string;
  newPassword: string;
};

export const ChangePasswordAction = async (
  formData: ChangePasswordDataType
): Promise<{ success: boolean; errors?: Record<string, string> }> => {
  const { email, oldPassword, newPassword } = formData;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      success: false,
      errors: {
        email: "Invalid email entered.",
      },
    };
  }

  try {
    const verifiePassword = await verifyPassword(user.password, oldPassword);

    if (!verifiePassword) {
      return {
        success: false,
        errors: {
          oldPassword: "Invalid password entered.",
        },
      };
    }

    const arePasswordsEqual = oldPassword === newPassword;

    if (arePasswordsEqual) {
      return {
        success: false,
        errors: {
          oldPassword: "Passwords can not be equal.",
        },
      };
    }
    await prisma.user.update({
      where: { email },
      data: {
        password: await hashPassword(newPassword),
      },
    });
  } catch (err) {
    console.log(err);
  }

  return { success: true };
};
