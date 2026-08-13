export type SubstackPost = {
  title: string;
  link: string;
  pubDate: string | null;
  excerpt: string;
  category: string | null;
};

export type SubstackFeedResult = {
  posts: SubstackPost[];
  error: string | null;
};
