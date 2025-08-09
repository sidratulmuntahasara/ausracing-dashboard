'use client';

import { motion } from 'framer-motion';

interface ProjectCardProps {
  name: string;
  progress: number;
  team: string;
  tasks: number;
  color: string;
}

const ProjectCard = ({ name, progress, team, tasks, color }: ProjectCardProps) => {
  return (
    <motion.div 
      className="bg-gray-800/30 backdrop-blur-md rounded-lg p-4 border border-gray-700/50 hover:border-purple-500/50 transition-colors"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white">{name}</h3>
          <p className="text-sm text-gray-400">{team} • {tasks} tasks</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${color}`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;