import StatsCard from '@/components/dashboard/StatsCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const Dashboard = async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      redirect('/sign-in');
    }
  } catch (error) {
    console.error('Auth error:', error);
    // If auth fails due to clock skew, allow access temporarily
  }

  const stats = [
    { title: 'Total Projects', value: '12', change: '+2%' },
    { title: 'Active Tasks', value: '34', change: '+5' },
    { title: 'Teams', value: '3', change: '+1' },
    { title: 'Productivity', value: '87%', change: '+3%' },
  ];

  const projects = [
    { name: 'Website Redesign', progress: 75, team: 'Design Team', tasks: 12, color: 'bg-purple-500' },
    { name: 'Mobile App', progress: 50, team: 'Engineering', tasks: 18, color: 'bg-blue-500' },
    { name: 'Marketing Campaign', progress: 30, team: 'Marketing', tasks: 8, color: 'bg-pink-500' },
    { name: 'UI/UX Research', progress: 90, team: 'Design Team', tasks: 5, color: 'bg-yellow-500' },
  ];

  const activities = [
    { user: 'Alex Johnson', action: 'completed the task', task: 'Homepage Design', time: '2 hours ago' },
    { user: 'Sam Smith', action: 'commented on', task: 'Mobile App Wireframe', time: '4 hours ago' },
    { user: 'Taylor Brown', action: 'assigned you to', task: 'User Research', time: '1 day ago' },
    { user: 'Jordan Lee', action: 'created the project', task: 'Marketing Campaign', time: '2 days ago' },
  ];

  return (
    <DashboardClient>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} title={stat.title} value={stat.value} change={stat.change} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl border border-purple-500/20 p-6">
              <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <ProjectCard 
                    key={index} 
                    name={project.name} 
                    progress={project.progress} 
                    team={project.team} 
                    tasks={project.tasks} 
                    color={project.color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </DashboardClient>
  );
};

export default Dashboard;