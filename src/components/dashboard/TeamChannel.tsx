import React from 'react';

interface TeamChannelProps {
  name: string;
  unread?: number;
}

const TeamChannel = ({ name, unread = 0 }: TeamChannelProps) => {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer">
      <div className="flex items-center">
        <span className="text-gray-400 mr-2">#</span>
        <span className="text-white">{name}</span>
      </div>
      {unread > 0 && (
        <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unread}
        </span>
      )}
    </div>
  );
};

export default TeamChannel;