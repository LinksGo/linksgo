import { Card } from '@/components/ui/card';
import { BarChart3, Users } from 'lucide-react';

export default function AnalyticsSection({ links = [] }) {
  // Calculate total clicks
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  
  // Calculate click through rate
  const ctr = links.length > 0 ? ((totalClicks / links.length) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
          <p className="text-2xl font-bold">{totalClicks}</p>
          <p className="text-sm text-gray-500 mt-1">All-time link clicks</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Click Rate</h3>
          <p className="text-2xl font-bold">{ctr}%</p>
          <p className="text-sm text-gray-500 mt-1">Average clicks per link</p>
        </Card>
      </div>
    </div>
  );
}
