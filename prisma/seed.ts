import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/enums.ts";
import { prisma } from "./prisma.ts";

const main = async () => {
  console.log("Starting database seeding...");

  const usersData = [
    {
      name: "Admin",
      role: Role.ADMIN,
      email: "admin@email.com",
      password: "Admin@12",
    },
    {
      name: "user1",
      role: Role.USER,
      email: "user1@email.com",
      password: "User1@123",
    },
    {
      name: "user2",
      role: Role.USER,
      email: "user2@email.com",
      password: "User2@123",
    },
    {
      name: "user3",
      role: Role.USER,
      email: "user3@email.com",
      password: "User3@123",
    },
    {
      name: "user4",
      role: Role.USER,
      email: "user4@email.com",
      password: "User4@123",
    },
  ];
  let blogData = [
    {
      title: "first test title",
      slug: "first_test_title",
      content: "This is my very first test blog. Please read it.",
      author: "user1",
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

  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
    console.log(`Upserted user: ${user.email}`);
  }

  for (const blog of blogData) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: {
        title: blog.title,
        content: blog.content,
        slug: blog.slug,
        author: blog.author,
      },
    });
    console.log(`Upserted user: ${blog.slug}`);
  }

  console.log("Database seeding completed!");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
