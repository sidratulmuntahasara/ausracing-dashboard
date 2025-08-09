interface Activity {
  user: string;
  action: string;
  task: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl border border-purple-500/20 p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full p-1">
              <div className="bg-gray-800 rounded-full p-1">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                <span className="font-semibold">{activity.user}</span> {activity.action} <span className="text-purple-400">{activity.task}</span>
              </p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;