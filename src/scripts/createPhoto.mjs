// src/scripts/createPhoto.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getCurrentJSTDate() {
  const now = new Date();
  const jstOffset = 9 * 60; // JSTはUTC+9時間
  const jstDate = new Date(now.getTime() + jstOffset * 60 * 1000);
  return jstDate;
}

async function createPhoto() {
  const newPhoto = await prisma.photo.create({
    data: {
      url: 'http://example.com/new-photo.jpg',
      title: 'New Photo',
      comment: 'This is a new photo.',
      created_at: getCurrentJSTDate(),
      updated_at: null, // 初期値としてnullを設定
      user: {
        connect: { id: '310ddfca-93d4-4032-ac41-0f8ff1ffbf5b' } // 適切なユーザーIDを指定してください
      }
    },
  });
  console.log('Created:', newPhoto);
}

createPhoto().catch(e => console.error(e));
