import Card from '@/components/ui/Card';

const ProjectsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>
      <Card>
        <h2 className="text-xl font-semibold mb-4">All Projects</h2>
        <p className="text-gray-400">Project list will be displayed here.</p>
      </Card>
    </div>
  );
};

export default ProjectsPage;