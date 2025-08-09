'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { pusherClient } from '@/lib/pusher';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
}

interface TeamChatModalProps {
  team: {
    id: string;
    name: string;
    color: string;
    members: Array<{
      id: string;
      userId: string;
      user: {
        id: string;
        name: string;
        email: string;
        profilePicture?: string;
      };
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

const TeamChatModal = ({ team, isOpen, onClose }: TeamChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isOpen && team.id) {
      fetchMessages();
      
      // Subscribe to real-time messages for this team
      const channel = pusherClient.subscribe(`team-${team.id}`);
      channel.bind('new-message', (data: Message) => {
        setMessages(prev => [...prev, data]);
      });

      return () => {
        pusherClient.unsubscribe(`team-${team.id}`);
      };
    }
  }, [isOpen, team.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/teams/${team.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/teams/${team.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTeamColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'purple': 'from-purple-500 to-purple-700',
      'blue': 'from-blue-500 to-blue-700',
      'green': 'from-green-500 to-green-700',
      'orange': 'from-orange-500 to-orange-700',
      'red': 'from-red-500 to-red-700',
      'pink': 'from-pink-500 to-pink-700',
      'indigo': 'from-indigo-500 to-indigo-700',
      'teal': 'from-teal-500 to-teal-700',
    };
    return colorMap[color] || 'from-gray-500 to-gray-700';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col m-4">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getTeamColorClasses(team.color)} p-4 rounded-t-lg flex justify-between items-center`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8V4a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{team.name}</h2>
                <p className="text-white/80 text-sm">{team.members.length} members</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Online Members */}
            <div className="flex -space-x-2">
              {team.members.slice(0, 4).map((member) => (
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
              {team.members.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                  +{team.members.length - 4}
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation by sending the first message!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.user.id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-3 max-w-xs lg:max-w-md ${message.user.id === userId ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    {message.user.profilePicture ? (
                      <img
                        src={message.user.profilePicture}
                        alt={message.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
                        {getUserInitials(message.user.name)}
                      </div>
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.user.id === userId 
                      ? `bg-gradient-to-r ${getTeamColorClasses(team.color)} text-white` 
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    <p className="text-sm font-medium mb-1">{message.user.name}</p>
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.user.id === userId ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={sending}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className={`px-6 py-3 bg-gradient-to-r ${getTeamColorClasses(team.color)} text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg`}
            >
              {sending ? (
                <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamChatModal;
