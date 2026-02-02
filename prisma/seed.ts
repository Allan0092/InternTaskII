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
