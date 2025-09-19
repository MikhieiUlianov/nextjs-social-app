"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";

const fetchPosts = async (pageParam: number, userProfileId?: string) => {
  const res = await fetch(
    "http://localhost:3000/api/posts?cursor=" +
      pageParam +
      "&user=" +
      userProfileId
  );
  return res.json();
};

const InfiniteFeed = ({ userProfileId }: { userProfileId?: string }) => {
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],

    queryFn: (
      // React Query автоматически передаёт сюда pageParam
      // при первом вызове это initialPageParam
      // при следующих вызовах — то, что вернул getNextPageParam
      { pageParam = 2 }
    ) => fetchPosts(pageParam, userProfileId),

    // стартовое значение для pageParam
    initialPageParam: 2,

    getNextPageParam: (
      // lastPage → результат последнего запроса (Response.json)
      lastPage,
      // pages → массив всех результатов (история запросов), включая lastPage
      pages
    ) =>
      // если сервер сказал, что есть ещё посты, вернём следующее значение
      // оно станет pageParam для следующего запроса
      lastPage.hasMore ? pages.length + 2 : undefined,
  });

  if (error) return "Something went wrong!";
  if (status === "pending") return "Loading...";

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h1>Posts are loading...</h1>}
      endMessage={<h1>All posts loaded!</h1>}
    >
      {allPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default InfiniteFeed;
