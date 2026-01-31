// prisma/seed.ts
import { HealthStatus, PrismaClient, Sex } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth-utils";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import { HabitatsData } from "./habitats-data";

// Import HabitatsData din fișierul tău

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

async function generateRandomAnimals(count: number, habitats: any[]) {
  const animals = [];

  for (let i = 0; i < count; i++) {
    animals.push({
      name: faker.animal.dog(),
      species: faker.lorem.words(3), // ✅ Nume științific fake (nu animal.cat())
      commonName: faker.lorem.words(2),
      age: faker.number.int({ min: 1, max: 15 }),
      sex: faker.helpers.enumValue(Sex), // ✅ Din enum-ul tău
      weight: faker.number.float({
        min: 5,
        max: 500,
        fractionDigits: 1, // ✅ Înlocuiește precision
      }),
      imageUrl: `https://picsum.photos/400/400?random=${i}`, // ✅ URL valid
      healthStatus: faker.helpers.enumValue(HealthStatus),
      habitatId: faker.helpers.arrayElement(habitats.map((h) => h.id)),
      arrivalDate: faker.date.past({ years: 3 }),
    });
  }

  return animals;
}

async function generateRandomTreatments(
  count: number,
  animals: any[],
  users: any[],
) {
  const treatments = [];

  for (let i = 0; i < count; i++) {
    treatments.push({
      title: faker.helpers.arrayElement([
        "Vaccination",
        "Checkup",
        "Dental",
        "Blood test",
      ]),
      notes: faker.lorem.sentence(),
      animalId: faker.helpers.arrayElement(animals.map((a) => a.id)),
      createdById: faker.helpers.arrayElement(users.map((u) => u.id)),
      date: faker.date.recent({ days: 365 }),
    });
  }

  return treatments;
}

async function generateRandomFeedings(
  count: number,
  animals: any[],
  users: any[],
) {
  const feedings = [];

  for (let i = 0; i < count; i++) {
    feedings.push({
      foodType: faker.commerce.product(),
      quantity: `${faker.number.int({ min: 1, max: 10 })} kg`,
      scheduled: faker.date.soon({ days: 30 }),
      animalId: faker.helpers.arrayElement(animals.map((a) => a.id)),
      fedById: faker.helpers.arrayElement(users.map((u) => u.id)),
    });
  }

  return feedings;
}

export async function main() {
  console.log("🌱 Starting FULL seed...");

  const randomUserCount = parseInt(process.argv[2] || "10");
  const randomAnimalCount = parseInt(process.argv[3] || "30");
  const randomTreatmentCount = parseInt(process.argv[4] || "50");
  const randomFeedingCount = parseInt(process.argv[5] || "100");

  console.log(
    `👥 Users: ${randomUserCount}, 🦁 Animals: ${randomAnimalCount}, 💊 Treatments: ${randomTreatmentCount}, 🍽️ Feedings: ${randomFeedingCount}`,
  );

  // 🧹 Clean everything
  if (process.env.NODE_ENV !== "production") {
    console.log("🧹 Cleaning database...");
    await prisma.treatment.deleteMany();
    await prisma.feeding.deleteMany();
    await prisma.animal.deleteMany();
    await prisma.habitat.deleteMany();
    await prisma.user.deleteMany();
  }

  // 👤 FIXED USERS
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

  // 🎲 RANDOM USERS
  console.log("🎲 Creating random users...");
  const randomUsers = await generateRandomUsers(randomUserCount);
  const randomUsersResult = await prisma.user.createMany({
    data: randomUsers,
    skipDuplicates: true,
  });

  // 🏞️ FIXED HABITATS
  console.log("🏞️ Creating fixed habitats...");
  const habitatsResult = await prisma.habitat.createMany({
    data: HabitatsData.map((habitat) => ({
      id: habitat.id,
      number: habitat.number,
      name: habitat.name,
      type: habitat.type,
      capacity: habitat.capacity,
      coordinates: habitat.coordinates,
      color: habitat.color,
      closed: habitat.closed,
    })),
    skipDuplicates: true,
  });

  // 🦁 RANDOM ANIMALS
  console.log("🦁 Creating random animals...");
  const allUsers = await prisma.user.findMany();
  const allHabitats = await prisma.habitat.findMany();
  const randomAnimals = await generateRandomAnimals(
    randomAnimalCount,
    allHabitats,
  );
  const animalsResult = await prisma.animal.createMany({
    data: randomAnimals,
    skipDuplicates: true,
  });

  // 💊 TREATMENTS
  console.log("💊 Creating treatments...");
  const allAnimals = await prisma.animal.findMany();
  const randomTreatments = await generateRandomTreatments(
    randomTreatmentCount,
    allAnimals,
    allUsers,
  );
  const treatmentsResult = await prisma.treatment.createMany({
    data: randomTreatments,
    skipDuplicates: true,
  });

  // 🍽️ FEEDINGS
  console.log("🍽️ Creating feedings...");
  const randomFeedings = await generateRandomFeedings(
    randomFeedingCount,
    allAnimals,
    allUsers,
  );
  const feedingsResult = await prisma.feeding.createMany({
    data: randomFeedings,
    skipDuplicates: true,
  });

  console.log(`
✅ SEED COMPLETED!
  👥 Users: ${fixedUsers.count + randomUsersResult.count}
  🏞️ Habitats: ${HabitatsData.length}
  🦁 Animals: ${animalsResult.count}
  💊 Treatments: ${treatmentsResult.count}
  🍽️ Feedings: ${feedingsResult.count}
  `);
}

main()
  .catch((error) => {
    console.error("❌ Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
