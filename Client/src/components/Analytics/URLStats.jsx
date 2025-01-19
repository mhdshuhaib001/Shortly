import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const URLStats = ({ urlId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/analytics/url/${urlId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [urlId]);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>No stats available</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">URL Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-sm font-medium text-blue-900">Total Clicks</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalClicks}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <h3 className="text-sm font-medium text-green-900">Unique Users</h3>
          <p className="text-2xl font-bold text-green-600">{stats.uniqueUsers}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Clicks Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.clicksByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Operating Systems</h3>
          <div className="space-y-2">
            {stats.osType.map((os) => (
              <div key={os.osName} className="flex justify-between items-center">
                <span>{os.osName}</span>
                <span className="font-medium">{os.uniqueClicks} clicks</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Device Types</h3>
          <div className="space-y-2">
            {stats.deviceType.map((device) => (
              <div key={device.deviceName} className="flex justify-between items-center">
                <span>{device.deviceName}</span>
                <span className="font-medium">{device.uniqueClicks} clicks</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLStats;