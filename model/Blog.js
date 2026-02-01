import { prisma } from "../prisma/prisma.ts";

const createBlog = async (blog) => {
  try {
    const { title, slug, content, author } = blog;
    const conn = await prisma.blog.create({
      data: {
        title: title,
        slug: slug,
        content: content,
        author: author,
      },
    });
    return conn;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const getAllBlogs = async () => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return blogs;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const getBlogBySlug = async (slug) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        slug: slug,
      },
    });
    return blog;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

export { createBlog, getAllBlogs, getBlogBySlug };
