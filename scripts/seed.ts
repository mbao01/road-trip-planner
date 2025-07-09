import { PrismaClient } from "@prisma/client"
import fs from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

// Hardcoded paths to mock data
const usersFilePath = path.join(process.cwd(), "data/users.json")
const tripsFilePath = path.join(process.cwd(), "data/trips.json")
const daysFilePath = path.join(process.cwd(), "data/days.json")
const stopsFilePath = path.join(process.cwd(), "data/stops.json")
const settingsFilePath = path.join(process.cwd(), "data/settings.json")

async function main() {
  console.log("Start seeding ...")

  // Clean up existing data
  await prisma.collaborator.deleteMany()
  await prisma.settings.deleteMany()
  await prisma.stop.deleteMany()
  await prisma.day.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.user.deleteMany()
  console.log("Cleaned up existing data.")

  // Seed Users
  const usersData = JSON.parse(await fs.readFile(usersFilePath, "utf-8"))
  await prisma.user.createMany({ data: usersData })
  console.log(`Seeded ${usersData.length} users.`)

  // Seed Trips, Days, Stops, Settings
  const tripsData = JSON.parse(await fs.readFile(tripsFilePath, "utf-8"))
  const daysData = JSON.parse(await fs.readFile(daysFilePath, "utf-8"))
  const stopsData = JSON.parse(await fs.readFile(stopsFilePath, "utf-8"))
  const settingsData = JSON.parse(await fs.readFile(settingsFilePath, "utf-8"))

  const owner = await prisma.user.findUnique({ where: { email: "owner@example.com" } })
  if (!owner) {
    throw new Error("Owner user not found. Make sure users.json is seeded correctly.")
  }

  for (const trip of tripsData) {
    const createdTrip = await prisma.trip.create({
      data: {
        id: trip.id,
        name: trip.name,
        dates: trip.dates,
        status: trip.status,
        ownerId: owner.id,
        days: {
          create: daysData
            .filter((d: any) => d.tripId === trip.id)
            .map((day: any) => ({
              id: day.id,
              date: day.date,
              order: day.order,
              stops: {
                create: stopsData
                  .filter((s: any) => s.dayId === day.id)
                  .map((stop: any) => ({
                    id: stop.id,
                    name: stop.name,
                    driving: stop.driving,
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                    order: stop.order,
                  })),
              },
            })),
        },
        settings: {
          create: settingsData.find((s: any) => s.tripId === trip.id),
        },
      },
    })
    console.log(`Created trip with id: ${createdTrip.id}`)
  }

  // Seed Collaborators
  const editor = await prisma.user.findUnique({ where: { email: "editor@example.com" } })
  const viewer = await prisma.user.findUnique({ where: { email: "viewer@example.com" } })
  if (!editor || !viewer) throw new Error("Editor or viewer not found.")

  await prisma.collaborator.create({
    data: { tripId: "coastal-cruise", userId: editor.id, role: "EDITOR" },
  })
  await prisma.collaborator.create({
    data: { tripId: "highland-fling", userId: viewer.id, role: "VIEWER" },
  })
  console.log("Seeded collaborators.")

  console.log("Seeding finished.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
