'use client';

import React, { useState, useEffect } from 'react';

interface TaskDetailModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: any) => void;
}

const TaskDetailModal = ({ task, isOpen, onClose, onUpdate }: TaskDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<any>({});

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    if (task?.id) {
      onUpdate(task.id, editedTask);
      setIsEditing(false);
    }
  };

  const getTeamHead = () => {
    if (task.assignees && task.assignees.length > 0) {
      const teamHead = task.assignees.find((assignee: any) => 
        assignee.user.role === 'ADMIN' || assignee.user.role === 'TEAM_LEAD'
      );
      return teamHead?.user || task.createdBy;
    }
    return task.createdBy;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const priorityColors: { [key: string]: string } = {
    LOW: 'bg-gray-700 text-gray-300',
    MEDIUM: 'bg-blue-700 text-blue-300',
    HIGH: 'bg-orange-700 text-orange-300',
    URGENT: 'bg-red-700 text-red-300'
  };

  const statusColors: { [key: string]: string } = {
    BACKLOG: 'bg-gray-700 text-gray-300',
    TODO: 'bg-blue-700 text-blue-300',
    IN_PROGRESS: 'bg-yellow-700 text-yellow-300',
    DONE: 'bg-green-700 text-green-300'
  };

  const teamHead = getTeamHead();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚩</span>
            <h2 className="text-2xl font-semibold text-white">Task Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Task Title</label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title || ''}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <h1 className="text-xl font-semibold text-white">{task.title}</h1>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Status</label>
              {isEditing ? (
                <select
                  value={editedTask.status || task.status}
                  onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="BACKLOG">Backlog</option>
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              ) : (
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status] || 'bg-gray-700 text-gray-300'}`}>
                  {task.status.replace('_', ' ')}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Priority</label>
              {isEditing ? (
                <select
                  value={editedTask.priority || task.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              ) : (
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority] || 'bg-gray-700 text-gray-300'}`}>
                  {task.priority}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            {isEditing ? (
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                rows={4}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Task description..."
              />
            ) : (
              <p className="text-gray-300 bg-gray-800 p-3 rounded-lg">
                {task.description || 'No description provided'}
              </p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Due Date</label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={editedTask.dueDate || ''}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-300">
                {task.dueDate ? formatDate(task.dueDate) : 'No due date set'}
              </p>
            )}
          </div>

          {/* Team and Project Information */}
          {task.project && (
            <div className="bg-gray-800 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-white flex items-center">
                <span className="mr-2 text-xl">👥</span>
                Team & Project Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-300">Team:</span>
                  <p className="text-blue-400 font-medium">{task.project.team?.name || 'No team assigned'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Project:</span>
                  <p className="text-blue-400 font-medium">{task.project.name}</p>
                </div>
              </div>
              {task.project.team?.description && (
                <div>
                  <span className="font-medium text-gray-300">Team Description:</span>
                  <p className="text-gray-400 text-sm mt-1">{task.project.team.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Team Head / Task Owner */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-white flex items-center mb-3">
              <span className="mr-2 text-xl">👑</span>
              Task Owner / Team Head
            </h3>
            <div className="flex items-center space-x-3">
              {teamHead?.profilePicture ? (
                <img
                  src={teamHead.profilePicture}
                  alt={teamHead.name || teamHead.email}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium">
                  {getUserInitials(teamHead?.name || teamHead?.email)}
                </div>
              )}
              <div>
                <p className="font-medium text-white">{teamHead?.name || 'Unknown User'}</p>
                <p className="text-sm text-gray-400">{teamHead?.email}</p>
                <p className="text-xs text-purple-400 font-medium">
                  {teamHead?.id === task.createdBy?.id ? 'Task Creator' : 'Team Lead'}
                </p>
              </div>
            </div>
          </div>

          {/* Assignees */}
          {task.assignees && task.assignees.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-white flex items-center">
                <span className="mr-2 text-xl">👤</span>
                Assignees ({task.assignees.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {task.assignees.map((assignee: any, index: number) => (
                  <div key={assignee.id || index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                    {assignee.user.profilePicture ? (
                      <img
                        src={assignee.user.profilePicture}
                        alt={assignee.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
                        {getUserInitials(assignee.user.name || assignee.user.email)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-white">{assignee.user.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-400">{assignee.user.email}</p>
                    </div>
                    <span className="text-green-400 text-lg">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Information */}
          <div className="bg-gray-800 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-white flex items-center">
              <span className="mr-2 text-xl">🕐</span>
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-300">Created:</span>
                <p className="text-gray-400">{formatDate(task.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-300">Last Updated:</span>
                <p className="text-gray-400">{formatDate(task.updatedAt)}</p>
              </div>
              {task.dueDate && (
                <div>
                  <span className="font-medium text-gray-300">Due Date:</span>
                  {isEditing ? (
                    <input
                      type="datetime-local"
                      value={editedTask.dueDate || ''}
                      onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                      className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-sm mt-1 text-white"
                    />
                  ) : (
                    <p className="text-gray-400">{formatDate(task.dueDate)}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Task Creator */}
          {task.createdBy && (
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-300">Created by:</span>
                {task.createdBy.profilePicture ? (
                  <img
                    src={task.createdBy.profilePicture}
                    alt={task.createdBy.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium text-xs">
                    {getUserInitials(task.createdBy.name || task.createdBy.email)}
                  </div>
                )}
                <span className="text-sm text-white font-medium">
                  {task.createdBy.name || 'Unknown User'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800">
          <div className="text-sm text-gray-400">
            Task ID: {task.id}
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTask({
                      title: task.title,
                      description: task.description,
                      status: task.status,
                      priority: task.priority,
                      dueDate: task.dueDate
                    });
                  }}
                  className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
