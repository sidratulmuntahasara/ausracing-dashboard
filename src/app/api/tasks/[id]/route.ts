import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;
    const body = await req.json();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, description, status, priority, assigneeIds } = body;

    // Update task
    const updatedTask = await db.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        status,
        priority,
        assignees: {
          // Delete existing assignees and reassign
          deleteMany: {},
          create: assigneeIds?.map((userId: string) => ({
            userId
          })) || [],
        },
      },
      include: {
        assignees: {
          include: {
            user: true
          }
        }
      }
    });

    // Trigger real-time update
    try {
      await pusherServer.trigger('tasks', 'task:updated', updatedTask);
    } catch (pusherError) {
      console.error('Pusher error:', pusherError);
      // Continue even if Pusher fails
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('[TASK_PUT]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First delete all assignees for this task
    await db.userTask.deleteMany({
      where: {
        taskId: id,
      },
    });

    // Then delete the task
    await db.task.delete({
      where: {
        id,
      },
    });

    // Trigger real-time update
    try {
      await pusherServer.trigger('tasks', 'task:deleted', id);
    } catch (pusherError) {
      console.error('Pusher error:', pusherError);
      // Continue even if Pusher fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[TASK_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}