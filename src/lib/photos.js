//This file contains the logic to fetch photos from the database using Prisma Client.
// The fetchPhotos function queries the database for all photos, including the associated user information, and orders them by creation date in descending order. 
//The function is exported so it can be used in other parts of the application, such as API routes or pages. 
//The Prisma Client instance is imported from the prisma module, which connects to the database and provides an interface for querying and manipulating data.

import prisma from './prisma';

export async function fetchPhotos() {
  return await prisma.photo.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
