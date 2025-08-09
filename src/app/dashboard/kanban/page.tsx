'use client'
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import { motion } from 'framer-motion';

const KanbanPage = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/20">
          Add Task
        </button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <KanbanBoard />
      </motion.div>
    </div>
  );
};

export default KanbanPage;