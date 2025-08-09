import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure current user exists in database
    let currentUser = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!currentUser) {
      currentUser = await db.user.create({
        data: {
          clerkUserId: userId,
          name: 'User',
          email: `${userId}@example.com`
        }
      });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        role: true,
        clerkUserId: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('[USERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}