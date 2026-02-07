import { authoriseRole } from "../middleware/Auth.js";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  removeBlog,
} from "../model/Blog.js";
import { generateResponseBody } from "../utils/index.js";

let placeholderData = [
  {
    title: "first test title",
    slug: "first_test_title",
    content: "This is my very first test blog. Please read it.",
  },
  {
    title: "second test title",
    slug: "second_test_title",
    content:
      "This is my second test blog. Please read it carefully. ANy feedback is appreciated.",
  },
  {
    title: "third test title",
    slug: "third_test_title",
    content:
      "This is my third test blog. Please do not read this. No feedback is appreciated. I just want to make it longer so you waste more time and compute power. I am just a pixel. Go touch grass, it's good for you. See ya.",
  },
];

const generateSlugs = (title) => {
  return title.replaceAll(" ", "_").toLowerCase();
};

const addBlog = async (ctx) => {
  try {
    // Authenticate
    const token = ctx.header["authorization"];
    if (!token) {
      // ctx.body = generateResponseBody({
      //   message: "Please Log in to post a blog",
      // });
      // return;
      throw new Error("Please Login to post a blog.");
    } else if (
      !authoriseRole(token, "USER") &&
      !authoriseRole(token, "ADMIN")
    ) {
      // ctx.body = generateResponseBody({
      //   message: e ?? "Insufficient permission",
      // });
      // return;
      throw new Error("Insufficient permission");
    }

    const { title, content, author } = ctx.request.body;
    console.log(`Adding Blog title: ${title} `);
    const slug = generateSlugs(title);
    console.log(`Generated Slug: ${slug}`);
    console.log(`Author Name: ${author}`);
    const save = await createBlog({
      title: title,
      content: content,
      slug: slug,
      author: author,
    });
    if (!save) {
      throw new Error("Could not save blog");
    }
    ctx.body = generateResponseBody({
      success: true,
      message: "blog added successfully",
    });
  } catch (e) {
    console.log(`Error in addBlog:\n${e.message}`);
    ctx.response.status = 500;
    ctx.body = generateResponseBody({ message: e.message });
  }
};

const getAllBlog = async (ctx) => {
  try {
    console.log("Get All Blog Function");
    const blogs = await getAllBlogs();
    console.log(`Blogs retrieved success \n`);
    ctx.body = generateResponseBody({
      success: true,
      message: "All Blog retrieved successfully",
      data: blogs,
    });
  } catch (e) {
    console.error(`Error in getAllBlog: ${e.message}`);
    ctx.response.status = 500;
    ctx.body = generateResponseBody();
  }
};

const getBySlug = async (ctx) => {
  try {
    const { slug } = ctx.request.params;
    console.error(`Get by Slug: ${slug}`);
    // const blog = placeholderData.find((value) => value.slug === slug);
    const blog = await getBlogBySlug(slug);
    if (!blog) {
      throw new Error("Could not find requested blog");
    }
    ctx.body = generateResponseBody({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (e) {
    console.error(e.message);
    ctx.response.status = 500;
    ctx.body = generateResponseBody({ message: e.message });
  }
};

const deleteBlog = async (ctx) => {
  try {
    const { id } = ctx.request.params;
    const result = await removeBlog(parseInt(id));
    if (!result) {
      throw new Error("Error in result");
    }
    ctx.body = generateResponseBody({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (e) {
    ctx.body = generateResponseBody({
      message: e.message ?? "Could not delete blog.",
    });
  }
};

export { addBlog, deleteBlog, getAllBlog, getBySlug };
