import { PrismaClient } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth-utils";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";

import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function generateRandomUsers(count: number) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const password = await hashPassword(
      faker.internet.password({ length: 12 }),
    );

    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email({ provider: "zoo.com" }),
      password,
      role: faker.helpers.arrayElement(["STAFF", "ADMIN"]),
    });
  }

  return users;
}

export async function main() {
  console.log("🌱 Starting seed...");

  // Accept number of random users as CLI argument
  const randomUserCount = parseInt(process.argv[2] || "10");
  console.log(`👥 Generating ${randomUserCount} random users...`);

  if (process.env.NODE_ENV !== "production") {
    console.log("🧹 Cleaning database...");
    await prisma.user.deleteMany();
  }

  console.log("👤 Creating fixed users...");
  const superAdminPassword = await hashPassword("sadmin123");
  const adminPassword = await hashPassword("admin123");
  const staffPassword = await hashPassword("staff123");

  const fixedUsers = await prisma.user.createMany({
    data: [
      {
        name: "SUPER_ADMIN",
        email: "superadmin@zoo.com",
        password: superAdminPassword,
        role: "SUPER_ADMIN",
      },
      {
        name: "Admin",
        email: "admin@zoo.com",
        password: adminPassword,
        role: "ADMIN",
      },
      {
        name: "Staff Member",
        email: "staff@zoo.com",
        password: staffPassword,
        role: "STAFF",
      },
    ],
    skipDuplicates: true,
  });

  console.log("🎲 Creating random users...");
  const randomUsers = await generateRandomUsers(randomUserCount);
  const randomUsersResult = await prisma.user.createMany({
    data: randomUsers,
    skipDuplicates: true,
  });

  console.log(
    `✅ Created ${fixedUsers.count} fixed + ${randomUsersResult.count} random users`,
  );
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("Error during seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
