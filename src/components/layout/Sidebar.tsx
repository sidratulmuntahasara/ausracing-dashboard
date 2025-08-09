'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  ViewColumnsIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Kanban', href: '/dashboard/kanban', icon: ViewColumnsIcon },
    { name: 'Projects', href: '/dashboard/projects', icon: ViewColumnsIcon },
    { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
    { name: 'Teams', href: '/dashboard/teams', icon: UserGroupIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  ];

  const teams = [
    { id: '1', name: 'Design Team' },
    { id: '2', name: 'Engineering' },
    { id: '3', name: 'Marketing' },
  ];

  return (
    <div className={`bg-gradient-to-b from-purple-900/50 to-blue-800/30 h-full flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out border-r border-purple-500/20`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">ProjectFlow</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-purple-300 p-1 rounded-full hover:bg-purple-800/30 transition-colors"
        >
          {collapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </button>
      </div>
      
      <nav className="flex-1 mt-6 px-2">
        {navigation.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className={`flex items-center px-4 py-3 my-1 text-sm font-medium rounded-lg transition-all duration-200 ${
              pathname === item.href 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-purple-200 hover:bg-purple-800/30'
            }`}>
              <item.icon className="h-5 w-5" />
              {!collapsed && <span className="ml-4">{item.name}</span>}
            </div>
          </Link>
        ))}
      </nav>
      
      <div className={`px-4 py-4 ${collapsed ? 'hidden' : 'block'}`}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400">Teams</h2>
        <div className="mt-4 space-y-1">
          {teams.map((team) => (
            <a key={team.id} href="#" className="block px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-purple-800/30 transition-colors">
              {team.name}
            </a>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-purple-500/20">
        <a href="#" className="flex items-center text-purple-300 hover:text-white transition-colors">
          <CogIcon className="h-5 w-5" />
          {!collapsed && <span className="ml-4">Settings</span>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;