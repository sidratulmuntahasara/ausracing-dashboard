import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teams = await db.teamModel.findMany({
      include: {
        members: {
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
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can create teams' }, { status: 403 });
    }

    const { name, description, color, members } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }

    // Create team
    const team = await db.teamModel.create({
      data: {
        name,
        description,
        color: color || 'purple',
        createdById: user.id,
        members: {
          create: members.map((memberId: string) => ({
            userId: memberId,
            role: 'MEMBER'
          }))
        }
      },
      include: {
        members: {
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
        },
        _count: {
          select: {
            members: true
          }
        }
      }
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
