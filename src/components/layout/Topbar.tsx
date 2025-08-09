import { UserButton } from '@clerk/nextjs';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';

const Topbar = () => {
  return (
    <header className="bg-gradient-to-r from-purple-900/30 to-blue-800/20 backdrop-blur-lg border-b border-purple-500/20 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-purple-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects, tasks, or teams..."
              className="pl-10 pr-4 py-2 bg-gray-800/50 rounded-lg border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-800/30 transition-colors">
            <BellIcon className="h-6 w-6" />
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;