import fs from "node:fs";
import { blogsConfig } from "../configs/blogs.config";

export type DocEntry = (typeof blogsConfig.posts)[number];

export const getDocBySlug = (slug: string[]): DocEntry | undefined => {
  const requestedPath = slug.join("/");
  return blogsConfig.posts.find((doc) => doc.path === requestedPath);
};

export const getDocContent = (doc: DocEntry): string => {
  return fs.readFileSync(doc.file, "utf-8");
};
