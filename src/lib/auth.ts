import { auth } from '@clerk/nextjs/server';

export const getCurrentUser = async () => {
  const { userId } = await auth();
  
  if (!userId) return null;
  
  // In a real app, you would fetch user from your database
  return {
    id: userId,
    name: 'User Name',
    email: 'user@example.com',
    role: 'admin',
  };
};