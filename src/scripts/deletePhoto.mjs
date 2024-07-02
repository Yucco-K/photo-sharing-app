// src/scripts/deletePhoto.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deletePhoto(id) {
  const deletedPhoto = await prisma.photo.delete({
    where: { id: id },
  });
  console.log('Deleted:', deletedPhoto);
}

// コマンドライン引数を取得
const [id] = process.argv.slice(2);

deletePhoto(id).catch(e => console.error(e)).finally(() => prisma.$disconnect());
// src/scripts/updatePhoto.mjs