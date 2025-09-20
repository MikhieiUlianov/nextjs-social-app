import Feed from "@/components/Feed";
import FollowButton from "@/components/FollowButton";
import Image from "@/components/Image";
import { prisma } from "@/prisma";
import { getUser } from "@/utils/getUser";
import Link from "next/link";
import { notFound } from "next/navigation";

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { user } = await getUser();
  const name = (await params).username;

  if (!user) return notFound();

  const userData = await prisma.user.findFirst({
    where: {
      username: name,
    },
    include: {
      _count: { select: { followers: true, followings: true } },
      followings: user.id ? { where: { followerId: user.id } } : undefined,
    },
  });
  if (!userData) throw new Error("Loading user profile page failed.");

  return (
    <div className="">
      {/* PROFILE TITLE */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">{userData.displayName}</h1>
      </div>
      {/* INFO */}
      <div className="">
        {/* COVER & AVATAR CONTAINER */}
        <div className="relative w-full">
          {/* COVER */}
          <div className="w-full aspect-[3/1] relative">
            <Image
              path={userData.cover || "general/noCover.png"}
              alt=""
              w={600}
              h={200}
              tr={true}
            />
          </div>
          {/* AVATAR */}
          <div className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
            <Image
              path={userData.img || "general/noAvatar.png"}
              alt=""
              w={100}
              h={100}
              tr={true}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 p-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/more.svg" alt="more" w={20} h={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/explore.svg" alt="more" w={20} h={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/message.svg" alt="more" w={20} h={20} />
          </div>
          <FollowButton
            userId={user.id}
            isFollowed={!!userData.followings.length}
          />
        </div>
        {/* USER DETAILS */}
        <div className="p-4 flex flex-col gap-2">
          {/* USERNAME & HANDLE */}
          <div className="">
            <h1 className="text-2xl font-bold">{userData.displayName}</h1>
            <span className="text-textGray text-sm">{userData.username}</span>
          </div>
          {userData.bio && <p>{userData.bio}</p>}
          {/* JOB & LOCATION & DATE */}
          <div className="flex gap-4 text-textGray text-[15px]">
            {userData.location && (
              <div className="flex items-center gap-2">
                <Image
                  path="icons/userLocation.svg"
                  alt="location"
                  w={20}
                  h={20}
                />
                <span>{userData.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Image path="icons/date.svg" alt="date" w={20} h={20} />
              <span>
                Joined{" "}
                {new Date(userData.createdAt.toString()).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
          {/* FOLLOWINGS & FOLLOWERS */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">{userData._count.followers}</span>
              <span className="text-textGray text-[15px]">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{userData._count.followings}</span>
              <span className="text-textGray text-[15px]">Followings</span>
            </div>
          </div>
        </div>
      </div>
      {/* FEED */}
      <Feed />
    </div>
  );
};

export default UserPage;
