import { prisma } from "@/prisma";
import Post from "./Post";
import { getUser } from "@/utils/getUser";

const Feed = async ({ userProfileId }: { userProfileId?: string }) => {
  const { user } = await getUser();
  if (!user || !user.id) return;

  let followingIds: string[] = [];

  if (!userProfileId) {
    const follows = await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });
    followingIds = follows.map((f) => f.followingId);
  }

  const whereCondition = userProfileId
    ? { parentPostId: null, userId: userProfileId }
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
      rePosts: { where: { userId: user.id }, select: { id: true } },
      _count: { select: { likes: true, rePosts: true, comments: true } },
      likes: { where: { userId: user.id }, select: { id: true } },
      saves: { where: { userId: user.id }, select: { id: true } },
    },
    take: 10,
    skip: 0,
    orderBy: { createdAt: "desc" },
  });
  console.log("feed", posts);
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default Feed;
