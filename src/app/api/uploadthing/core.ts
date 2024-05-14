import { utapi } from '@/app/server/uploadthing';
// import { auth } from '@/auth';
import db from '@/db/prisma';
import { notFound } from 'next/navigation';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

// const authentication = async () => {
//   const session = await auth();

//   return session?.user;
// };

const auth = (req: Request) => ({ id: 'clw66gj260000b13h14oiuww7' });

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user?.id }; // Use optional chaining to access the id property
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      const id = metadata.userId;

      const imageUrl = file.url;

      try {
        const user = await db.user.findUnique({
          where: { id },
        });

        if (!user) return notFound();

        const prevImage = user.image;

        if (prevImage?.startsWith('https://utfs.io')) {
          const fileKey = prevImage.split('https://utfs.io/f/')[1];
          await utapi.deleteFiles(fileKey);
        }

        await db.user.update({
          where: { id },
          data: {
            image: imageUrl,
          },
        });
      } catch (error) {
        console.error('Error updating user:', error);
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
