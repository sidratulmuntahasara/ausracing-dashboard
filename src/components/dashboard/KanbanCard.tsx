import { Draggable } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  assignees: unknown[];
}

interface KanbanCardProps {
  task: Task;
  index: number;
}

const KanbanCard = ({ task, index }: KanbanCardProps) => {
  // Ensure task has valid id and title
  if (!task || !task.id || !task.title) {
    return null;
  }

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
    <Draggable draggableId={String(task.id)} index={index} isDragDisabled={false}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-gradient-to-br from-gray-800/50 to-gray-900/30 backdrop-blur-lg p-4 rounded-lg shadow border ${
            snapshot.isDragging 
              ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
              : 'border-gray-700/50'
          }`}
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-white">{task.title}</h4>
            <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
          </div>
          <div className="flex mt-3">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
            <div className="text-xs text-gray-400 ml-2">Due: Tomorrow</div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;