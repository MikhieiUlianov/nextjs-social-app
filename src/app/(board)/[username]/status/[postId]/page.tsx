import Comments from "@/components/Comments";
import Image from "@/components/Image";
import Post from "@/components/Post";
import { prisma } from "@/prisma";
import { getUser } from "@/utils/getUser";
import Link from "next/link";
import { notFound } from "next/navigation";

const StatusPage = async ({
  params,
}: {
  params: Promise<{ username: string; postId: string }>;
}) => {
  const { user } = await getUser();
  if (!user) throw new Error("No user found (status).");

  const postId = (await params).postId;

  const post = await prisma.post.findFirst({
    where: { id: Number(postId) },
    include: {
      user: { select: { displayName: true, username: true, img: true } },

      rePosts: { where: { userId: user.id }, select: { id: true } },
      _count: { select: { likes: true, rePosts: true, comments: true } },
      likes: { where: { userId: user.id }, select: { id: true } },
      saves: { where: { userId: user.id }, select: { id: true } },
      comments: {
        include: {
          user: { select: { displayName: true, username: true, img: true } },

          rePosts: { where: { userId: user.id }, select: { id: true } },
          _count: { select: { likes: true, rePosts: true, comments: true } },
          likes: { where: { userId: user.id }, select: { id: true } },
          saves: { where: { userId: user.id }, select: { id: true } },
        },
      },
    },
    take: 10,
    skip: 0,
    orderBy: { createdAt: "desc" },
  });

  if (!post) return notFound();

  return (
    <div className="">
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </div>
      <Post type="status" post={post} />
      <Comments
        comments={post.comments}
        postId={post.id}
        username={post.user.username}
      />
    </div>
  );
};

export default StatusPage;
