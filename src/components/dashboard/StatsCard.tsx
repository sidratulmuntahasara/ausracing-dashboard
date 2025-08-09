'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
}

const StatsCard = ({ title, value, change }: StatsCardProps) => {
  const isPositive = change.startsWith('+');
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-purple-900/30 to-blue-800/20 backdrop-blur-lg rounded-xl border border-purple-500/20 p-6"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <h3 className="text-sm font-medium text-purple-300">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-semibold text-white">{value}</p>
        <p className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;