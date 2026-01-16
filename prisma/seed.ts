import { PrismaClient } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth-utils";
import { PrismaPg } from "@prisma/adapter-pg";

import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  console.log("🌱 Starting seed...");

  if (process.env.NODE_ENV === "development") {
    console.log("🧹 Cleaning database...");
    await prisma.user.deleteMany();
  }

  console.log("👤 Creating users...");

  const superAdminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");
  const staffPassword = await hashPassword("staff123");

  const users = await prisma.user.createMany({
    data: [
      {
        name: "SUPER_ADMIN",
        email: "superadmin@zoo.com",
        password: superAdminPassword,
        role: "SUPER_ADMIN",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: userPassword,
        role: "STAFF",
      },
      {
        name: "Staff Member",
        email: "staff@example.com",
        password: staffPassword,
        role: "STAFF",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${users.count} users`);

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
