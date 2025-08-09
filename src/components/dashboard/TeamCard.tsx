'use client';

import { useState } from 'react';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    description: string;
    color: string;
    members: Array<{
      id: string;
      userId: string;
      role: string;
      user: {
        id: string;
        name: string;
        email: string;
        profilePicture?: string;
      };
    }>;
    _count: {
      members: number;
    };
  };
  onClick: () => void;
  isAccessible: boolean;
  isAdmin: boolean;
  onEdit?: () => void;
}

const TeamCard = ({ team, onClick, isAccessible, isAdmin, onEdit }: TeamCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTeamColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'purple': 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-400',
      'blue': 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400',
      'green': 'bg-gradient-to-br from-green-500 to-green-700 border-green-400',
      'orange': 'bg-gradient-to-br from-orange-500 to-orange-700 border-orange-400',
      'red': 'bg-gradient-to-br from-red-500 to-red-700 border-red-400',
      'pink': 'bg-gradient-to-br from-pink-500 to-pink-700 border-pink-400',
      'indigo': 'bg-gradient-to-br from-indigo-500 to-indigo-700 border-indigo-400',
      'teal': 'bg-gradient-to-br from-teal-500 to-teal-700 border-teal-400',
    };
    return colorMap[color] || 'bg-gradient-to-br from-gray-500 to-gray-700 border-gray-400';
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div
      className={`relative rounded-xl p-6 cursor-pointer transform transition-all duration-300 border-2 ${
        isAccessible 
          ? `${getTeamColorClasses(team.color)} hover:scale-105 shadow-lg hover:shadow-xl` 
          : 'bg-gray-800 border-gray-600 opacity-60'
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Admin Edit Button */}
      {isAdmin && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}

      {/* Team Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
        <p className="text-white/80 text-sm line-clamp-2">{team.description}</p>
      </div>

      {/* Members Preview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm font-medium">Members</span>
          <span className="text-white/80 text-sm">{team._count.members}</span>
        </div>
        <div className="flex -space-x-2">
          {team.members.slice(0, 5).map((member, index) => (
            <div
              key={member.id}
              className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-medium text-white"
              title={member.user.name}
            >
              {member.user.profilePicture ? (
                <img
                  src={member.user.profilePicture}
                  alt={member.user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getUserInitials(member.user.name)
              )}
            </div>
          ))}
          {team._count.members > 5 && (
            <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-medium text-white">
              +{team._count.members - 5}
            </div>
          )}
        </div>
      </div>

      {/* Access Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isAccessible ? (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Accessible</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Restricted</span>
            </>
          )}
        </div>
        
        {isHovered && isAccessible && (
          <div className="flex items-center space-x-1 text-white/80">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">Chat</span>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      {isHovered && isAccessible && (
        <div className="absolute inset-0 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-white font-medium">Open Team Chat</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
