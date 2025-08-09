import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
}

const ProgressBar = ({ value, max = 100, color = 'bg-gradient-to-r from-purple-500 to-blue-500', className = '' }: ProgressBarProps) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
      <div 
        className={`h-2 rounded-full ${color}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;