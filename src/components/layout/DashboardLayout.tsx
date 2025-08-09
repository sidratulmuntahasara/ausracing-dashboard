import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-800/20 to-gray-900/50 backdrop-blur-lg">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;