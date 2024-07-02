import prisma from './prisma';

export async function fetchPhotos() {
  try {
    const photos = await prisma.photo.findMany({
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
    return photos;
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw new Error('Error fetching photos');
  }
}
