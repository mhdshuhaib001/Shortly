import React from 'react';
import StatCard from './StatCard';
import { Link2, Activity, Users, Bookmark } from 'lucide-react';

const StatsOverview = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard
      icon={Link2}
      label="Total URLs"
      value={stats?.totalUrls || 0}
      bgColor="bg-indigo-100"
      iconColor="text-indigo-600"
    />
    <StatCard
      icon={Activity}
      label="Total Clicks"
      value={stats?.totalClicks || 0}
      bgColor="bg-green-100"
      iconColor="text-green-600"
    />
    <StatCard
      icon={Users}
      label="Unique Visitors"
      value={stats?.uniqueUsers || 0}
      bgColor="bg-blue-100"
      iconColor="text-blue-600"
    />
    <StatCard
      icon={Bookmark}
      label="Topics"
      value={stats?.totalTopics || 0}
      bgColor="bg-purple-100"
      iconColor="text-purple-600"
    />
  </div>
);

export default StatsOverview;