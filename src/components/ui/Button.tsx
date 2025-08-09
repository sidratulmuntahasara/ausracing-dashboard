import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '', 
  onClick,
  disabled = false
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 shadow-lg shadow-purple-500/20 disabled:opacity-50",
    secondary: "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 disabled:opacity-50",
    ghost: "text-purple-300 hover:text-white disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
  };

  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;