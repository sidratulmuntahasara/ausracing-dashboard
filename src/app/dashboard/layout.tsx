import { ReactNode } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import db from '@/lib/db';

export default async function Layout({ children }: { children: ReactNode }) {
  const clerkUser = await currentUser();
  
  if (!clerkUser?.id) redirect('/sign-in');
  
  // Fetch or create user
  let user = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });
  
  if (!user) {
    // Create user with Clerk details
    user = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? 'user@example.com',
        name: clerkUser.fullName ?? 'New User',
        role: 'MEMBER',
      },
    });
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
