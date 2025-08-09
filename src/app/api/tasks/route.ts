import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function GET() {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First ensure user exists in database
    let user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      // Create user if doesn't exist
      const clerkUser = await auth();
      user = await db.user.create({
        data: {
          clerkUserId: userId,
          name: 'User',
          email: `${userId}@example.com`
        }
      });
    }

    // Get all tasks - simplified approach without teams/projects for now
    const tasks = await db.task.findMany({
      include: {
        createdBy: true,  // Include the creator information
        assignees: {
          include: {
            user: true
          }
        }
      } as any
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('[TASKS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, description, status, priority, assigneeIds } = body;

    // Ensure user exists
    let user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      const clerkUser = await auth();
      user = await db.user.create({
        data: {
          clerkUserId: userId,
          name: 'User',
          email: `${userId}@example.com`
        }
      });
    }

    // Create or find a default project for tasks
    let defaultProject = await db.project.findFirst({
      where: { name: 'Default Project' }
    });

    if (!defaultProject) {
      // Create default team first
      let defaultTeam = await db.teamModel.findFirst({
        where: { name: 'Default Team' }
      });

      if (!defaultTeam) {
        defaultTeam = await db.teamModel.create({
          data: {
            name: 'Default Team',
            description: 'Default team for tasks',
            createdById: user.id
          }
        });
      }

      defaultProject = await db.project.create({
        data: {
          name: 'Default Project',
          description: 'Default project for tasks',
          teamId: defaultTeam.id
        }
      });
    }

    // Create task
    const task = await db.task.create({
      data: {
        title,
        description: description || "",
        status,
        priority,
        projectId: defaultProject.id,
        createdById: user.id,  // Add the createdBy relationship
        assignees: {
          create: assigneeIds?.map((userId: string) => ({
            userId
          })) || [],
        },
      } as any,
      include: {
        createdBy: true,  // Include the creator information
        assignees: {
          include: {
            user: true
          }
        }
      } as any
    });

    // Trigger real-time update
    try {
      await pusherServer.trigger('tasks', 'task:created', task);
    } catch (pusherError) {
      console.error('Pusher error:', pusherError);
      // Continue even if Pusher fails
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('[TASK_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}