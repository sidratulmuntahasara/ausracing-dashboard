import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  assignees: unknown[];
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

const KanbanColumn = ({ column, tasks }: KanbanColumnProps) => {
  return (
    <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/20 backdrop-blur-lg rounded-xl border border-purple-500/20 p-4">
      <h3 className="font-medium text-white mb-4 flex items-center">
        <span className="mr-2">{column.title}</span>
        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </h3>
      <Droppable droppableId={column.id} isDropDisabled={false}>
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-[500px]"
          >
            {tasks.map((task: Task, index: number) => (
              <KanbanCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;