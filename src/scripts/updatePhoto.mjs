// src/scripts/updatePhoto.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getCurrentJSTDate() {
  const now = new Date();
  const jstOffset = 9 * 60; // JSTはUTC+9時間
  const jstDate = new Date(now.getTime() + jstOffset * 60 * 1000);
  return jstDate;
}

async function updatePhoto(id, newTitle) {
  const updatedPhoto = await prisma.photo.update({
    where: { id: id },
    data: { 
      title: newTitle,
      updated_at: getCurrentJSTDate()
    },
  });

  console.log('Updated:', updatedPhoto);
}

// コマンドライン引数を取得
const [id, newTitle] = process.argv.slice(2);

updatePhoto(id, newTitle).catch(e => console.error(e)).finally(() => prisma.$disconnect());
// src/scripts/updatePhoto.mjs