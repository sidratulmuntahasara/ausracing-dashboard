import CalendarView from '@/components/dashboard/CalendarView';

const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl border border-purple-500/20 p-6">
        <CalendarView />
      </div>
    </div>
  );
};

export default CalendarPage;