import { Draggable } from '@hello-pangea/dnd';
import Button from '@/components/ui/Button';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignees: {
    user: {
      id: string;
      name: string;
      email: string;
      profilePicture?: string;
    };
  }[];
  createdBy: {
    id: string;
    name: string;
  };
}

interface KanbanCardProps {
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

const KanbanCard = ({ task, index, onEdit, onDelete, onViewDetails }: KanbanCardProps) => {
  const getPriorityColor = (priority: string) => {
    const lowerPriority = priority.toLowerCase();
    switch (lowerPriority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-gradient-to-br from-gray-800/50 to-gray-900/30 backdrop-blur-lg p-4 rounded-lg shadow border transition-all duration-200 ${
            snapshot.isDragging 
              ? 'border-purple-500 shadow-lg shadow-purple-500/20 rotate-3 scale-105' 
              : 'border-gray-700/50 hover:border-purple-500/40'
          }`}
          style={{
            ...provided.draggableProps.style,
            ...(snapshot.isDragging && {
              transform: `${provided.draggableProps.style?.transform} rotate(3deg)`,
            })
          }}
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-white flex-1">{task.title}</h4>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
              {/* Subtle drag indicator */}
              <div className="flex flex-col space-y-0.5 opacity-50 hover:opacity-100 transition-opacity">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mt-2 line-clamp-2">{task.description}</p>
          
          <div className="flex items-center mt-3">
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee) => (
                <div 
                  key={assignee.user.id} 
                  className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full p-0.5"
                  title={assignee.user.name}
                >
                  <div className="bg-gray-800 rounded-full p-0.5">
                    {assignee.user.profilePicture ? (
                      <img
                        src={assignee.user.profilePicture}
                        alt={assignee.user.name}
                        className="rounded-full w-6 h-6 object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs text-white font-semibold">${assignee.user.name.charAt(0).toUpperCase()}</div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs text-white font-semibold">
                        {assignee.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {task.assignees.length > 3 && (
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full p-0.5">
                  <div className="bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs text-white font-semibold">
                    +{task.assignees.length - 3}
                  </div>
                </div>
              )}
            </div>
            
            <div className="ml-auto flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onViewDetails()}
                className="text-gray-400 hover:text-blue-400"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit()}
                className="text-gray-400 hover:text-white"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete()}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            Created by: {task.createdBy.name}
            <br />
            Assignees: {task.assignees.map(assignee => assignee.user.name).join(', ')}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;