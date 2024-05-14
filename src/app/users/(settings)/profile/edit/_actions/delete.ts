'use server';

import { signOut } from '@/auth';
import db from '@/db/prisma';
import fs from 'fs/promises';

export async function deleteAccount(id: string) {
  try {
    const user = await db.user.delete({
      where: { id },
    });

    if (user.image?.startsWith('/avatars')) {
      await fs.unlink(`public${user.image}`);
    }

    return { message: 'Your account has been successfully deleted.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete User.' };
  }
}

export async function logout() {
  await signOut();
}
