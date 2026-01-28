import { prisma } from "../prisma/prisma.ts";

const createBlog = async (blog) => {
  const { title, slug, content } = blog;
  const conn = await prisma.blog.create({
    data: {
      title: title,
      slug: slug,
      content: content,
    },
  });
  return conn;
};

const getAllBlogs = async () => {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return blogs;
};

const getBlogBySlug = async (slug) => {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: slug,
    },
  });
  return blog;
};

export { createBlog, getAllBlogs, getBlogBySlug };
