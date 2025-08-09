import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const tasks = await db.task.findMany({
      include: {
        assignees: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
