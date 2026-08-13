import { createServerFn } from "@tanstack/react-start";

export const getSubstackPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchSubstackPosts } = await import("./rss.server");
  return fetchSubstackPosts();
});
