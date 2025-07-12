import { prisma } from "@/lib/prisma"

export const getTripsByUserId = async (userId: string) => {
  return prisma.trip.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          collaborators: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      days: {
        include: {
          stops: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  })
}
