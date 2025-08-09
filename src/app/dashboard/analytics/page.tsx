import Card from '@/components/ui/Card';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Project Analytics</h2>
        <p className="text-gray-400">Analytics charts and data will be displayed here.</p>
      </Card>
    </div>
  );
};

export default AnalyticsPage;