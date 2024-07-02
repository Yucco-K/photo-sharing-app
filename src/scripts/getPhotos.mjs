import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getPhotos() {
  const photos = await prisma.photo.findMany();

  photos.forEach(photo => {
    console.log({
      ...photo,
      created_at: photo.created_at,
      updated_at: photo.updated_at
    });
  });
}

getPhotos().catch(e => console.error(e)).finally(() => prisma.$disconnect());
// src/scripts/deletePhoto.mjs
// src/scripts/updatePhoto.mjs
// src/scripts/createPhoto.mjs
// src/scripts/getPhotos.mjs
