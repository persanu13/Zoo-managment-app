// prisma/seed.ts
import {
  HealthStatus,
  PrismaClient,
  Sex,
  TaskPriority,
  TaskStatus,
  TaskType,
} from "@/generated/prisma/client";
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

function pickRandomId(arr: { id: string }[]) {
  return arr[Math.floor(Math.random() * arr.length)]?.id ?? null;
}

function randomBool(p = 0.5) {
  return Math.random() < p;
}

async function generateRandomTasks(
  count: number,
  animals: any[],
  habitats: any[],
  treatments: any[],
  users: any[],
) {
  const tasks = [];

  for (let i = 0; i < count; i++) {
    const type = faker.helpers.enumValue(TaskType);
    const priority = faker.helpers.enumValue(TaskPriority);

    // status: mai multe TODO / IN_PROGRESS decât DONE
    const status = faker.helpers.weightedArrayElement<TaskStatus>([
      { value: TaskStatus.TODO, weight: 45 },
      { value: TaskStatus.IN_PROGRESS, weight: 25 },
      { value: TaskStatus.BLOCKED, weight: 10 },
      { value: TaskStatus.DONE, weight: 18 },
      { value: TaskStatus.CANCELED, weight: 2 },
    ]);

    const createdById = faker.helpers.arrayElement(users.map((u) => u.id));
    const assignedToId = randomBool(0.75)
      ? faker.helpers.arrayElement(users.map((u) => u.id))
      : null;

    // timing logic
    const now = new Date();
    const dueDate =
      status === TaskStatus.DONE
        ? faker.date.recent({ days: 30 })
        : faker.date.soon({ days: 30 });

    const startAt =
      status === TaskStatus.IN_PROGRESS || status === TaskStatus.DONE
        ? faker.date.recent({ days: 14 })
        : null;

    const completedAt =
      status === TaskStatus.DONE
        ? faker.date.between({ from: startAt ?? now, to: now })
        : null;

    // link logic (în funcție de tip)
    let animalId: string | null = null;
    let habitatId: string | null = null;
    let treatmentId: string | null = null;

    if (type === TaskType.MEDICAL) {
      // medical: preferă să lege de treatment, și de animal implicit
      if (treatments.length > 0 && randomBool(0.8)) {
        const t = faker.helpers.arrayElement(treatments);
        treatmentId = t.id;
        animalId = t.animalId ?? null;
      } else {
        animalId = pickRandomId(animals);
      }
    } else if (type === TaskType.FEEDING || type === TaskType.TRANSFER) {
      animalId = pickRandomId(animals);
      // transfer: uneori are și habitat țintă
      if (type === TaskType.TRANSFER && randomBool(0.6)) {
        habitatId = pickRandomId(habitats);
      }
    } else if (type === TaskType.CLEANING || type === TaskType.MAINTENANCE) {
      habitatId = pickRandomId(habitats);
      // uneori cleaning e despre un animal anume (ex: cușca unui animal)
      if (randomBool(0.25)) animalId = pickRandomId(animals);
    } else if (type === TaskType.INVENTORY) {
      // inventory: de obicei fără legături
      if (randomBool(0.15)) habitatId = pickRandomId(habitats);
    } else {
      // GENERAL: rareori are legături
      if (randomBool(0.2)) animalId = pickRandomId(animals);
      if (randomBool(0.2)) habitatId = pickRandomId(habitats);
    }

    // title/description simple
    const titleByType: Record<string, string[]> = {
      GENERAL: ["General check", "Staff briefing", "Update records"],
      FEEDING: ["Prepare feeding", "Feed animal", "Check feeding schedule"],
      CLEANING: ["Clean habitat", "Disinfect enclosure", "Replace bedding"],
      MEDICAL: ["Medical follow-up", "Vet check", "Administer treatment"],
      MAINTENANCE: ["Fix gate", "Inspect fence", "Repair water system"],
      TRANSFER: ["Prepare transfer", "Move animal", "Habitat reassignment"],
      INVENTORY: ["Count supplies", "Order food", "Check medical stock"],
    };

    const title = faker.helpers.arrayElement(titleByType[type] ?? ["Task"]);
    const description = faker.lorem.sentence();

    tasks.push({
      title,
      description,
      type,
      status,
      priority,
      dueDate,
      startAt,
      completedAt,
      assignedToId,
      createdById,
      animalId,
      habitatId,
      treatmentId,
    });
  }

  return tasks;
}

export async function main() {
  console.log("🌱 Starting FULL seed...");

  const randomUserCount = parseInt(process.argv[2] || "10");
  const randomAnimalCount = parseInt(process.argv[3] || "30");
  const randomTreatmentCount = parseInt(process.argv[4] || "50");
  const randomFeedingCount = parseInt(process.argv[5] || "100");
  const randomTaskCount = parseInt(process.argv[6] || "120");

  console.log(
    `👥 Users: ${randomUserCount}, 🦁 Animals: ${randomAnimalCount}, 💊 Treatments: ${randomTreatmentCount}, 🍽️ Feedings: ${randomFeedingCount}`,
  );

  // 🧹 Clean everything
  if (process.env.NODE_ENV !== "production") {
    console.log("🧹 Cleaning database...");
    await prisma.task.deleteMany();
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

  // Tasks
  console.log("🧩 Creating tasks...");
  const allTreatments = await prisma.treatment.findMany();
  const randomTasks = await generateRandomTasks(
    randomTaskCount,
    allAnimals,
    allHabitats,
    allTreatments,
    allUsers,
  );

  const tasksResult = await prisma.task.createMany({
    data: randomTasks,
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
  🧩 Tasks: ${tasksResult.count}
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
