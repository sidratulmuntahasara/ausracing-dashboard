'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import TeamCard from '@/components/dashboard/TeamCard';
import TeamModal from '@/components/dashboard/TeamModal';
import TeamChatModal from '@/components/dashboard/TeamChatModal';

interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
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
}

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'ADMIN';

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData: any) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        fetchTeams();
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleTeamClick = (team: Team) => {
    // Check if user is a member of this team
    const isMember = team.members.some(member => member.userId === userId);
    
    if (isMember || isAdmin) {
      setSelectedTeam(team);
      setIsChatModalOpen(true);
    } else {
      alert('You are not a member of this team. Contact an admin to join.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Teams</h1>
          <p className="text-gray-400 mt-1">Collaborate with your team members</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Team</span>
          </button>
        )}
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No teams created yet</div>
          {isAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Your First Team
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onClick={() => handleTeamClick(team)}
              isAccessible={team.members.some(member => member.userId === userId) || isAdmin}
              isAdmin={isAdmin}
              onEdit={isAdmin ? () => {
                // Handle edit team
                console.log('Edit team:', team);
              } : undefined}
            />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <TeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTeam}
        />
      )}

      {isChatModalOpen && selectedTeam && (
        <TeamChatModal
          team={selectedTeam}
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedTeam(null);
          }}
        />
      )}
    </div>
  );
};

export default TeamsPage;