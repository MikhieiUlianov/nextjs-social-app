"use server";

import z from "zod";
import { prisma } from "./prisma";
import { imagekit } from "./utils";
import { getUser } from "./utils/getUser";
import { revalidatePath } from "next/cache";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

export const followUser = async (targetUserId: string) => {
  const { user } = await getUser();

  if (!user) throw new Error("Registration is required to make this action.");

  const existingFollow = await prisma.follow.findFirst({
    where: { followerId: user.id, followingId: targetUserId },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });
  } else {
    await prisma.follow.create({
      data: { followerId: user.id, followingId: targetUserId },
    });
  }
};

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

export const addComment = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { user } = await getUser();

  if (!user) throw new Error("Registration is required to make this action.");

  const postId = formData.get("postId");
  const desc = formData.get("desc");
  const username = formData.get("username");

  const Comment = z.object({
    parentPostId: z.number(),
    desc: z.string().max(140),
  });

  const validatedFields = Comment.safeParse({
    parentPostId: Number(postId),
    desc,
  });

  if (!validatedFields.success) return { success: false, error: true };

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId: user.id,
      },
    });

    revalidatePath(`/${username}/status/${postId}`);

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const addPost = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { user } = await getUser();
  if (!user) throw new Error("User not found.");
  const userId = user.id;

  if (!userId) return { success: false, error: true };

  const desc = formData.get("desc");
  const file = formData.get("file") as File;
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType");

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `w-600,${
      imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
    }`;

    return new Promise((resolve, reject) => {
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
        },
        function (error, result) {
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

  const Post = z.object({
    desc: z.string().max(140),
    isSensitive: z.boolean().optional(),
  });

  const validatedFields = Post.safeParse({
    desc,
    isSensitive: JSON.parse(isSensitive),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  let img = "";
  let imgHeight = 0;
  let video = "";

  if (file.size) {
    const result: UploadResponse = await uploadFile(file);

    if (result.fileType === "image") {
      img = result.filePath;
      imgHeight = result.height;
    } else {
      video = result.filePath;
    }
  }

  console.log({
    ...validatedFields.data,
    userId,
    img,
    imgHeight,
    video,
  });

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId,
        img,
        imgHeight,
        video,
      },
    });
    revalidatePath(`/`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
  return { success: false, error: true };
};
