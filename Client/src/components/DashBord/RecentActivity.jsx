import React from 'react';

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {activities?.slice(0, 5).map((activity, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
            <span className="text-sm text-gray-600">{activity.action}</span>
          </div>
          <span className="text-sm text-gray-500">{activity.time}</span>
        </div>
      ))}
    </div>
  </div>
);

export default RecentActivity;