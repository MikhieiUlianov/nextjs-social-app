"use server";

import { prisma } from "./prisma";
import { imagekit } from "./utils";
import { getUser } from "./utils/getUser";

export const likePost = async (postId: number) => {
  const { user } = await getUser();

  if (!user) throw new Error("Registration is required to make this action.");

  const existingLike = await prisma.like.findFirst({
    where: { userId: user.id, postId },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.like.create({
      data: { userId: user.id, postId },
    });
  }
};
export const rePostPost = async (postId: number) => {
  const { user } = await getUser();

  if (!user) throw new Error("Registration is required to make this action.");

  const existingRePost = await prisma.post.findFirst({
    where: { userId: user.id, rePostId: postId },
  });

  if (existingRePost) {
    await prisma.post.delete({
      where: { id: existingRePost.id },
    });
  } else {
    await prisma.post.create({
      data: { userId: user.id, rePostId: postId },
    });
  }
};
export const savePost = async (postId: number) => {
  const { user } = await getUser();

  if (!user) throw new Error("Registration is required to make this action.");

  const existingSavedPost = await prisma.savedPosts.findFirst({
    where: { userId: user.id, postId },
  });

  if (existingSavedPost) {
    await prisma.savedPosts.delete({
      where: { id: existingSavedPost.id },
    });
  } else {
    await prisma.savedPosts.create({
      data: { userId: user.id, postId },
    });
  }
};

export const shareAction = async (
  formData: FormData,
  settings: { type: "original" | "wide" | "square"; sensitive: boolean }
) => {
  const file = formData.get("file") as File;
  // const desc = formData.get("desc") as string;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const transformation = `w-600, ${
    settings.type === "square"
      ? "ar-1-1"
      : settings.type === "wide"
      ? "ar-16-9"
      : ""
  }`;

  imagekit.upload(
    {
      file: buffer,
      fileName: file.name,
      folder: "/posts",
      ...(file.type.includes("image") && {
        transformation: {
          pre: transformation,
        },
      }),
      customMetadata: {
        sensitive: settings.sensitive,
      },
    },
    function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    }
  );
};
