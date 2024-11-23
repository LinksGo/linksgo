import { Card } from '@/components/ui/card';

export default function AnalyticsSection({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mt-4">
      {/* Summary Cards */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
        <p className="text-2xl font-bold">{stats.totalViews}</p>
        <p className="text-sm text-gray-500 mt-1">All-time profile views</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Views Per Day</h3>
        <p className="text-2xl font-bold">{stats.viewRate}</p>
        <p className="text-sm text-gray-500 mt-1">Average daily views</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Links</h3>
        <p className="text-2xl font-bold">{stats.totalLinks}</p>
        <p className="text-sm text-gray-500 mt-1">Active links in your profile</p>
      </Card>
    </div>
  );
}
