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
  return title.replaceAll(" ", "_");
};

const generateResponseBody = (
  success = false,
  message = "An error occured",
  data = {},
) => {
  return { success: success, message: message, data: data };
};

const addBlog = async (ctx) => {
  try {
    const { title, content } = ctx.request.body;
    console.log(`Adding Blog title: ${title} `);
    const slug = generateSlugs(title);
    console.log(`Generated Slug: ${slug}`);
  } catch (e) {
    console.error(e.message);
    ctx.response.status = 500;
    ctx.body = generateResponseBody();
  }
};

const getAllBlog = async (ctx) => {
  try {
    console.log("Get All Blog Function");
    ctx.body = generateResponseBody(
      true,
      "All Blog retrieved successfully",
      placeholderData,
    );
  } catch (e) {
    console.error(e.message);
    ctx.response.status = 500;
    ctx.body = generateResponseBody();
  }
};

const getBySlug = async (ctx) => {
  try {
    const { slug } = ctx.request.params;
    console.error(`Get by Slug: ${slug}`);
    ctx.body = generateResponseBody(
      true,
      "Slug retrieved successfully",
      placeholderData[0],
    );
  } catch (e) {
    console.error(e.message);
    ctx.response.status = 500;
    ctx.body = generateResponseBody();
  }
};

export { addBlog, getAllBlog, getBySlug };
