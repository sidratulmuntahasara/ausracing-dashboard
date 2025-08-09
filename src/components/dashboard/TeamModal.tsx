'use client';

import { useState, useEffect } from 'react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamData: any) => void;
  team?: any; // For editing existing teams
}

const TeamModal = ({ isOpen, onClose, onSubmit, team }: TeamModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'purple',
    members: [] as string[]
  });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const colors = [
    { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
    { name: 'Green', value: 'green', bg: 'bg-green-500' },
    { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
    { name: 'Red', value: 'red', bg: 'bg-red-500' },
    { name: 'Pink', value: 'pink', bg: 'bg-pink-500' },
    { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-500' },
    { name: 'Teal', value: 'teal', bg: 'bg-teal-500' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (team) {
        setFormData({
          name: team.name,
          description: team.description,
          color: team.color,
          members: team.members?.map((m: any) => m.userId) || []
        });
      }
    }
  }, [isOpen, team]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const users = await response.json();
        setAvailableUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Team name is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', description: '', color: 'purple', members: [] });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {team ? 'Edit Team' : 'Create New Team'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter team name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your team's purpose and goals"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Team Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-white'
                      : 'border-transparent hover:border-gray-600'
                  }`}
                >
                  <div className={`w-full h-8 rounded ${color.bg} mb-2`}></div>
                  <span className="text-sm text-gray-300">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Team Members ({formData.members.length} selected)
            </label>
            <div className="max-h-48 overflow-y-auto space-y-2 bg-gray-800 rounded-lg p-4">
              {availableUsers.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Loading users...</p>
              ) : (
                availableUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      formData.members.includes(user.id)
                        ? 'bg-purple-600/20 border border-purple-500'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => toggleMember(user.id)}
                  >
                    <div className="flex-shrink-0">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium">
                          {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {formData.members.includes(user.id) ? (
                        <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-400 rounded"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating...' : (team ? 'Update Team' : 'Create Team')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
