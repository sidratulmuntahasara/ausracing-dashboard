'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  assignees: unknown[];
}

interface ApiTask {
  id: string;
  title: string;
  priority: string;
  status: string;
  assignees: Array<{ user: unknown }>;
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const tasksData = await response.json();
        
        // Format tasks for kanban board
        const formattedTasks: Record<string, Task> = {};
        const updatedColumns = {
          BACKLOG: { id: 'BACKLOG', title: 'Backlog', taskIds: [] as string[] },
          TODO: { id: 'TODO', title: 'To Do', taskIds: [] as string[] },
          IN_PROGRESS: { id: 'IN_PROGRESS', title: 'In Progress', taskIds: [] as string[] },
          REVIEW: { id: 'REVIEW', title: 'Review', taskIds: [] as string[] },
          DONE: { id: 'DONE', title: 'Done', taskIds: [] as string[] },
        };
        
        tasksData.forEach((task: ApiTask) => {
          formattedTasks[task.id] = {
            id: task.id,
            title: task.title,
            priority: task.priority,
            status: task.status,
            assignees: task.assignees.map((a) => a.user)
          };
          
          // Add task to appropriate column
          if (updatedColumns[task.status as keyof typeof updatedColumns]) {
            updatedColumns[task.status as keyof typeof updatedColumns].taskIds.push(task.id);
          }
        });
        
        setTasks(formattedTasks);
        setColumns(updatedColumns);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // For now, we'll use mock data if the API fails
        const mockTasks = {
          task1: { id: 'task1', title: 'Design system setup', priority: 'HIGH', status: 'BACKLOG', assignees: [] },
          task2: { id: 'task2', title: 'User authentication', priority: 'MEDIUM', status: 'BACKLOG', assignees: [] },
          task3: { id: 'task3', title: 'Database schema', priority: 'HIGH', status: 'BACKLOG', assignees: [] },
          task4: { id: 'task4', title: 'API integration', priority: 'MEDIUM', status: 'TODO', assignees: [] },
          task5: { id: 'task5', title: 'Dashboard UI', priority: 'LOW', status: 'IN_PROGRESS', assignees: [] },
          task6: { id: 'task6', title: 'Testing suite', priority: 'HIGH', status: 'IN_PROGRESS', assignees: [] },
          task7: { id: 'task7', title: 'Documentation', priority: 'LOW', status: 'REVIEW', assignees: [] },
          task8: { id: 'task8', title: 'Deployment setup', priority: 'MEDIUM', status: 'DONE', assignees: [] },
        };
        setTasks(mockTasks);
        setColumns({
          BACKLOG: { id: 'BACKLOG', title: 'Backlog', taskIds: ['task1', 'task2', 'task3'] },
          TODO: { id: 'TODO', title: 'To Do', taskIds: ['task4'] },
          IN_PROGRESS: { id: 'IN_PROGRESS', title: 'In Progress', taskIds: ['task5', 'task6'] },
          REVIEW: { id: 'REVIEW', title: 'Review', taskIds: ['task7'] },
          DONE: { id: 'DONE', title: 'Done', taskIds: ['task8'] },
        });
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

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
  }  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // No movement
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
    
    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.values(columns).map((column) => {
          // Filter out undefined tasks and ensure all tasks have valid data
          const columnTasks = column.taskIds
            .map((taskId) => tasks[taskId])
            .filter((task: Task | undefined): task is Task => task !== undefined && Boolean(task.id && task.title));
          
          return (
            <KanbanColumn 
              key={column.id} 
              column={column} 
              tasks={columnTasks}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;