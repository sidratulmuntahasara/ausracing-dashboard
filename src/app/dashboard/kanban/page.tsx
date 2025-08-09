'use client';

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