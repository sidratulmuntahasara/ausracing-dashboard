import { UserButton } from '@clerk/nextjs';
import React from 'react';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar = ({ size = 'md' }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-purple-500`}>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default UserAvatar;