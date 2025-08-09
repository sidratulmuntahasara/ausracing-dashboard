// Compatibility wrapper for react-beautiful-dnd with React 19
// This addresses the StrictMode issues in React 19
import React from 'react';

// Temporarily disable StrictMode for react-beautiful-dnd components
export const DndProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render DnD on server-side or until client is ready
  if (!isClient) {
    return <div>{children}</div>;
  }

  return children;
};
