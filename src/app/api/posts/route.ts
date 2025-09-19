import { prisma } from "@/prisma";
import { getUser } from "@/utils/getUser";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const { user } = await getUser();
  if (!user || !user.id) return;

  const userProfileId = searchParams.get("user");
  const page = searchParams.get("cursor")!;
  const LIMIT = 3;

  let followingIds: string[] = [];

  if (!userProfileId) {
    const follows = await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });
    followingIds = follows.map((f) => f.followingId);
  }

  const whereCondition =
    userProfileId !== "undefined"
      ? { parentPostId: null, userId: userProfileId as string }
      : { parentPostId: null, userId: { in: [user.id, ...followingIds] } };

  const posts = await prisma.post.findMany({
    where: whereCondition,
    include: {
      user: { select: { displayName: true, username: true, img: true } },
      rePost: {
        include: {
          user: { select: { displayName: true, username: true, img: true } },
          _count: { select: { likes: true, rePosts: true, comments: true } },
          likes: { where: { userId: user.id }, select: { id: true } },
          rePosts: { where: { userId: user.id }, select: { id: true } },
          saves: { where: { userId: user.id }, select: { id: true } },
        },
      },
      _count: { select: { likes: true, rePosts: true, comments: true } },
      likes: { where: { userId: user.id }, select: { id: true } },
      rePosts: { where: { userId: user.id }, select: { id: true } },
      saves: { where: { userId: user.id }, select: { id: true } },
    },

    take: LIMIT,
    skip: (Number(page) - 1) * LIMIT,
    orderBy: { createdAt: "desc" },
  });

  const totalPosts = await prisma.post.count({ where: whereCondition });
  const hasMore = Number(page) * LIMIT < totalPosts;
  return Response.json({ posts, hasMore });
}
