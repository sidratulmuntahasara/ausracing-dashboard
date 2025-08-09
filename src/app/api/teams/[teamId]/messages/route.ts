import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is member of the team or admin
    const teamMember = await db.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        userId: user.id
      }
    });

    const isAdmin = user.role === 'ADMIN';

    if (!teamMember && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const messages = await db.teamMessage.findMany({
      where: {
        teamId: params.teamId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 100 // Limit to last 100 messages
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching team messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is member of the team or admin
    const teamMember = await db.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        userId: user.id
      }
    });

    const isAdmin = user.role === 'ADMIN';

    if (!teamMember && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const message = await db.teamMessage.create({
      data: {
        content: content.trim(),
        teamId: params.teamId,
        userId: user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          }
        }
      }
    });

    // Send real-time notification via Pusher
    await pusherServer.trigger(`team-${params.teamId}`, 'new-message', message);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating team message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
