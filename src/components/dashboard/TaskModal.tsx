'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '@/components/ui/Button';
import { User } from '@prisma/client';

interface Task {
  id?: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignees: {
    user: {
      id: string;
      name: string;
    };
  }[];
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  const [status, setStatus] = useState(task?.status || 'BACKLOG');
  const [assignees, setAssignees] = useState<string[]>(task?.assignees.map(a => a.user.id) || []);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setAssignees(task.assignees.map(a => a.user.id));
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus('BACKLOG');
      setAssignees([]);
    }
  }, [task]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    // Only fetch users when modal opens and users array is empty
    if (isOpen && users.length === 0) {
      fetchUsers();
    }
  }, [isOpen, users.length]);

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const taskData = {
        title,
        description,
        priority,
        status,
        assigneeIds: assignees
      };
      
      if (task?.id) {
        // Update existing task
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
      } else {
        // Create new task
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create task');
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAssignee = (userId: string) => {
    setAssignees(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-left align-middle shadow-xl transition-all border border-purple-500/30">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  {task?.id ? 'Edit Task' : 'Create New Task'}
                </Dialog.Title>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Priority
                      </label>
                      <select
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="BACKLOG">Backlog</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Assignees
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {users.map(user => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => toggleAssignee(user.id)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            assignees.includes(user.id)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {user.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button 
                    variant="secondary" 
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading || !title.trim()}
                  >
                    {loading ? 'Saving...' : (task?.id ? 'Update Task' : 'Create Task')}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskModal;