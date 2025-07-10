import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Hardcoded paths to mock data
const usersFilePath = path.join(process.cwd(), "data/users.json");
const providersFilePath = path.join(process.cwd(), "data/providers.json");
const tripsFilePath = path.join(process.cwd(), "data/trips.json");
const daysFilePath = path.join(process.cwd(), "data/days.json");
const stopsFilePath = path.join(process.cwd(), "data/stops.json");
const settingsFilePath = path.join(process.cwd(), "data/settings.json");

async function main() {
  console.log("Start seeding ...");

  // Clean up existing data
  await prisma.collaborator.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.day.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleaned up existing data.");

  // Seed Users
  const usersData = JSON.parse(await fs.readFile(usersFilePath, "utf-8"));
  const providersData = JSON.parse(await fs.readFile(providersFilePath, "utf-8"));
  await prisma.user.createMany({
    data: usersData,
  });
  await prisma.provider.createMany({
    data: providersData,
  });
  console.log(`Seeded ${usersData.length} users.`);

  // Seed Trips, Days, Stops, Settings
  const tripsData = JSON.parse(await fs.readFile(tripsFilePath, "utf-8"));
  const daysData = JSON.parse(await fs.readFile(daysFilePath, "utf-8"));
  const stopsData = JSON.parse(await fs.readFile(stopsFilePath, "utf-8"));
  const settingsData = JSON.parse(await fs.readFile(settingsFilePath, "utf-8"));

  const owner = await prisma.user.findUnique({
    where: { email: "owner@example.com" },
  });
  if (!owner) {
    throw new Error("Owner user not found. Make sure users.json is seeded correctly.");
  }

  for (const trip of tripsData) {
    const { tripId, ...settings } = settingsData.find((s: any) => s.tripId === trip.id) || {};
    const createdTrip = await prisma.trip.create({
      data: {
        id: String(trip.id),
        name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        status: trip.status,
        ownerId: owner.id,
        settings: {
          create: settings,
        },
      },
    });

    await prisma.day.createMany({
      data: daysData
        .filter((d: any) => d.tripId === trip.id)
        .map((day: any) => ({
          id: String(day.id),
          tripId: createdTrip.id,
          date: day.date,
          order: day.order,
        })),
    });

    await Promise.all(
      daysData
        .filter((d: any) => d.tripId === trip.id)
        .map((day: any) =>
          prisma.stop.createMany({
            data: stopsData
              .filter((s: any) => s.dayId === day.id)
              .map((stop: any) => ({
                id: String(stop.id),
                name: stop.name,
                dayId: day.id,
                tripId: createdTrip.id,
                latitude: stop.latitude,
                longitude: stop.longitude,
                order: stop.order,
              })),
          })
        )
    );
    console.log(`Created trip with id: ${createdTrip.id}`);
  }

  console.log("Seeded trips, days, stops, and settings.");
  // Seed Collaborators
  const editor = await prisma.user.findUnique({
    where: { email: "editor@example.com" },
  });
  console.log("Seeded editor.");
  const viewer = await prisma.user.findUnique({
    where: { email: "viewer@example.com" },
  });
  console.log("Seeded viewer.");
  if (!editor || !viewer) throw new Error("Editor or viewer not found.");

  await prisma.collaborator.create({
    data: {
      tripId: "coastal-cruise",
      userId: String(editor.id),
      role: "EDITOR",
    },
  });
  await prisma.collaborator.create({
    data: {
      tripId: "highland-fling",
      userId: String(viewer.id),
      role: "VIEWER",
    },
  });
  console.log("Seeded collaborators.");

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
