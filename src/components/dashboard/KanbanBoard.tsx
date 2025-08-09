'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { pusherClient } from '@/lib/pusher';
import TaskModal from './TaskModal';
import TaskDetailModal from './TaskDetailModal';
import Button from '@/components/ui/Button';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@clerk/nextjs';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignees: {
    user: {
      id: string;
      name: string;
      email: string;
      profilePicture?: string;
      role?: string;
    };
  }[];
  createdBy: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  project: {
    id: string;
    name: string;
    description?: string;
    team: {
      id: string;
      name: string;
      description?: string;
    };
  };
}

interface ApiTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignees: Array<{ user: any }>;
  createdBy: any;
  project: any;
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    BACKLOG: {
      id: 'BACKLOG',
      title: 'Backlog',
      taskIds: [] as string[],
    },
    TODO: {
      id: 'TODO',
      title: 'To Do',
      taskIds: [] as string[],
    },
    IN_PROGRESS: {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      taskIds: [] as string[],
    },
    REVIEW: {
      id: 'REVIEW',
      title: 'Review',
      taskIds: [] as string[],
    },
    DONE: {
      id: 'DONE',
      title: 'Done',
      taskIds: [] as string[],
    },
  });

  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { addNotification } = useNotifications();
  const { userId } = useAuth();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasksData: ApiTask[] = await response.json();
      
      // Format tasks for kanban board
      const formattedTasks: Record<string, Task> = {};
      const updatedColumns = {
        BACKLOG: { id: 'BACKLOG', title: 'Backlog', taskIds: [] as string[] },
        TODO: { id: 'TODO', title: 'To Do', taskIds: [] as string[] },
        IN_PROGRESS: { id: 'IN_PROGRESS', title: 'In Progress', taskIds: [] as string[] },
        REVIEW: { id: 'REVIEW', title: 'Review', taskIds: [] as string[] },
        DONE: { id: 'DONE', title: 'Done', taskIds: [] as string[] },
      };
      
      tasksData.forEach((task) => {
        formattedTasks[task.id] = {
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: task.updatedAt || new Date().toISOString(),
          assignees: task.assignees || [],
          createdBy: task.createdBy || { id: '', name: '', email: '' },
          project: task.project || {
            id: 'default',
            name: 'Default Project',
            team: {
              id: 'default',
              name: 'Default Team',
            }
          },
        };
        
        if (updatedColumns[task.status as keyof typeof updatedColumns]) {
          updatedColumns[task.status as keyof typeof updatedColumns].taskIds.push(task.id);
        }
      });
      
      setTasks(formattedTasks);
      setColumns(updatedColumns);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); // Remove tasks dependency to prevent infinite loop

  useEffect(() => {
    // Setup Pusher for real-time updates - separate useEffect
    try {
      const channel = pusherClient.subscribe('tasks');
      
      channel.bind('task:created', (newTask: ApiTask) => {
        const task: Task = {
          id: newTask.id,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          status: newTask.status,
          dueDate: newTask.dueDate,
          createdAt: newTask.createdAt || new Date().toISOString(),
          updatedAt: newTask.updatedAt || new Date().toISOString(),
          assignees: newTask.assignees || [],
          createdBy: newTask.createdBy || { id: '', name: '', email: '' },
          project: newTask.project || {
            id: 'default',
            name: 'Default Project',
            team: {
              id: 'default',
              name: 'Default Team',
            }
          },
        };
        
        setTasks(prev => ({ ...prev, [task.id]: task }));
        setColumns(prev => ({
          ...prev,
          [task.status]: {
            ...prev[task.status as keyof typeof prev],
            // Prevent duplicates by checking if task ID already exists
            taskIds: prev[task.status as keyof typeof prev].taskIds.includes(task.id) 
              ? prev[task.status as keyof typeof prev].taskIds
              : [...prev[task.status as keyof typeof prev].taskIds, task.id]
          }
        }));

        // Add notification if user is assigned to the task
        if (userId && task.assignees.some(assignee => assignee.user.id === userId)) {
          addNotification({
            type: 'task_assigned',
            title: 'New Task Assigned',
            message: `You have been assigned to "${task.title}"`,
            taskId: task.id,
            fromUser: {
              id: task.createdBy.id,
              name: task.createdBy.name || 'Unknown User',
              profilePicture: task.createdBy.profilePicture
            }
          });
        }
      });
      
      channel.bind('task:updated', (updatedTask: ApiTask) => {
        const task: Task = {
          id: updatedTask.id,
          title: updatedTask.title,
          description: updatedTask.description,
          priority: updatedTask.priority,
          status: updatedTask.status,
          dueDate: updatedTask.dueDate,
          createdAt: updatedTask.createdAt || new Date().toISOString(),
          updatedAt: updatedTask.updatedAt || new Date().toISOString(),
          assignees: updatedTask.assignees || [],
          createdBy: updatedTask.createdBy || { id: '', name: '', email: '' },
          project: updatedTask.project || {
            id: 'default',
            name: 'Default Project',
            team: {
              id: 'default',
              name: 'Default Team',
            }
          },
        };
        
        setTasks(prev => {
          const oldStatus = prev[task.id]?.status;
          const updatedTasks = { ...prev, [task.id]: task };
          
          // If status changed, update columns
          if (oldStatus && oldStatus !== task.status) {
            setColumns(current => ({
              ...current,
              [oldStatus]: {
                ...current[oldStatus as keyof typeof current],
                taskIds: current[oldStatus as keyof typeof current].taskIds.filter(id => id !== task.id)
              },
              [task.status]: {
                ...current[task.status as keyof typeof current],
                // Prevent duplicates by checking if task ID already exists
                taskIds: current[task.status as keyof typeof current].taskIds.includes(task.id)
                  ? current[task.status as keyof typeof current].taskIds
                  : [...current[task.status as keyof typeof current].taskIds, task.id]
              }
            }));
          }
          
          return updatedTasks;
        });
      });
      
      channel.bind('task:deleted', (deletedTaskId: string) => {
        setTasks(prev => {
          const task = prev[deletedTaskId];
          if (!task) return prev;
          
          const { [deletedTaskId]: _, ...rest } = prev;
          
          setColumns(current => ({
            ...current,
            [task.status]: {
              ...current[task.status as keyof typeof current],
              taskIds: current[task.status as keyof typeof current].taskIds.filter(id => id !== deletedTaskId)
            }
          }));
          
          return rest;
        });
      });

      return () => {
        try {
          channel.unbind_all();
          channel.unsubscribe();
        } catch (error) {
          console.error('Error cleaning up Pusher subscription:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up Pusher:', error);
      return () => {};
    }
  }, []); // Empty dependency array for Pusher setup

  const onDragEnd = (result: DropResult) => {
    // Re-enable text selection after drag
    document.body.style.userSelect = '';
    
    const { source, destination, draggableId } = result;
    
    if (!destination) return;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    const start = columns[source.droppableId as keyof typeof columns];
    const finish = columns[destination.droppableId as keyof typeof columns];
    
    // Moving within same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      
      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }
    
    // Moving from one column to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };
    
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
    
    // Update task status in backend
    updateTaskStatus(draggableId, destination.droppableId);
    
    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const task = tasks[taskId];
      if (!task) return;
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          status: newStatus,
          assigneeIds: task.assignees.map(a => a.user.id)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const task = tasks[taskId];
      if (!task) return;
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          ...updates,
          assigneeIds: task.assignees.map(a => a.user.id)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Add notification for task updates
      addNotification({
        type: 'task_updated',
        title: 'Task Updated',
        message: `Task "${task.title}" has been updated`,
        taskId: task.id
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {['Backlog', 'To Do', 'In Progress', 'Review', 'Done'].map((title) => (
          <div key={title} className="bg-gradient-to-b from-gray-800/30 to-gray-900/20 backdrop-blur-lg rounded-xl border border-purple-500/20 p-4">
            <h3 className="font-medium text-white mb-4 flex items-center">
              <span className="mr-2">{title}</span>
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full animate-pulse">
                ...
              </span>
            </h3>
            <div className="space-y-3 min-h-[500px]">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/20 backdrop-blur-lg p-4 rounded-lg shadow border border-gray-700/50 animate-pulse h-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        onClick={handleCreateTask}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/20"
      >
        Add Task
      </Button>
      
      <DragDropContext 
        onDragEnd={onDragEnd}
        // Improve drag experience
        onBeforeCapture={() => {
          // Optional: Add any pre-drag setup here
        }}
        onDragStart={() => {
          // Disable text selection during drag
          document.body.style.userSelect = 'none';
        }}
        onDragUpdate={() => {
          // Optional: Handle drag updates
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.values(columns).map((column) => {
            // Get unique tasks for this column and filter out any nulls/duplicates
            const columnTasks = column.taskIds
              .map(taskId => tasks[taskId])
              .filter((task, index, array) => 
                task && array.findIndex(t => t && t.id === task.id) === index
              );
            
            return (
              <KanbanColumn 
                key={column.id} 
                column={column} 
                tasks={columnTasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onViewDetails={handleViewDetails}
              />
            );
          })}
        </div>
      </DragDropContext>
      
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Refresh tasks when modal closes to ensure we see any changes
          fetchTasks();
        }}
        task={editingTask}
      />

      <TaskDetailModal 
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
};

export default KanbanBoard;