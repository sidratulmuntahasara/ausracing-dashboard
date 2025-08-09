import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

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

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onViewDetails: (task: Task) => void;
}

const KanbanColumn = ({ column, tasks, onEditTask, onDeleteTask, onViewDetails }: KanbanColumnProps) => {
  return (
    <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/20 backdrop-blur-lg rounded-xl border border-purple-500/20 p-4">
      <h3 className="font-medium text-white mb-4 flex items-center">
        <span className="mr-2">{column.title}</span>
        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </h3>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[500px] p-2 rounded-lg transition-all duration-200 ${
              snapshot.isDraggingOver 
                ? 'bg-purple-500/10 border-2 border-purple-500/30 border-dashed' 
                : 'border-2 border-transparent'
            }`}
          >
            {tasks.map((task, index) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                index={index} 
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
                onViewDetails={() => onViewDetails(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;