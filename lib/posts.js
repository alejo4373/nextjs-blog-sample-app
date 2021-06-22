import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export async function getSortedPostData() {
  try {
    const filesNames = await fs.readdir(postsDirectory);
    const filesContents = await Promise.all(
      filesNames.map((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        return fs.readFile(fullPath, "utf8");
      })
    );

    const posts = filesNames.map((fileName, i) => {
      const id = fileName.replace(/\.md$/, "");
      const matterResult = matter(filesContents[i]);
      return {
        id,
        ...matterResult.data,
      };
    });

    return posts.sort(({ date: a }, { date: b }) => {
      if (a < b) return 1;
      if (a > b) return -1;
      return 0;
    });
  } catch (err) {
    throw err;
  }
}

export async function getAllPostsIds() {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    return fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ""),
        },
      };
    });
  } catch (err) {
    throw err;
  }
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  try {
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();
    return {
      id,
      ...data,
      contentHtml,
    };
  } catch (err) {
    throw err;
  }
}
