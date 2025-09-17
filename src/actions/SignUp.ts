"use server";

import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/hash";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

type SignUpDataType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export const SignUpAction = async (
  formData: SignUpDataType
): Promise<{ success: boolean; errors?: Record<string, string> }> => {
  const { name, email, password, confirmPassword } = formData;

  const errors: Record<string, string> = {};

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    errors.email =
      "Seems that the email already exists. Please choose another one";
  }

  if (!name || name.trim().length < 2) {
    errors.name = "Name must have at least 2 characters.";
  } else if (name.length > 30) {
    errors.name = "Name cannot have more than 30 characters.";
  }

  if (!email) {
    errors.email = "The field is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "The field is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  } else if (
    !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(password)
  ) {
    errors.password =
      "Password must contain at least one uppercase letter, one number, and one special character.";
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  const hashedPassword = await hashPassword(password);
  if (Object.keys(errors).length > 0) {
    console.log(Object.keys(errors).length > 0);
    return { success: false, errors };
  }

  const createdUser = await prisma.user.create({
    data: {
      username: name,
      email,
      password: hashedPassword,
    },
  });
  console.log("created  user", createdUser);
  await createSession(createdUser.id);

  redirect("/");
};
