import db from '@/db/prisma';
import { notFound } from 'next/navigation';
import bcrypt from 'bcryptjs';

export default async function verifyToken(token: string, email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) notFound();

    if (!user.otp || !user.otp_expires) return false;

    const isTokenMatch = await bcrypt.compare(token, user.otp);

    if (!isTokenMatch) return false;

    const isTokenExpired = new Date() > user.otp_expires;

    if (isTokenExpired) return false;

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
