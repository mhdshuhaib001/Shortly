import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useParams } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const URLStats = () => {
  const { urlId } = useParams();
  const [stats, setStats] = useState({
    totalClicks: 0,
    uniqueUsers: 0,
    clicksByDate: [],
    osType: [],
    deviceTypes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/analytics/url/${urlId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const transformedData = {
          totalClicks: response.data.totalClicks || 0,
          uniqueUsers: response.data.uniqueUsers || 0,
          clicksByDate: response.data.clicksByDate || [],
          osType: Array.isArray(response.data.osType) 
            ? response.data.osType.map(os => ({
                osName: os,
                uniqueClicks: response.data.totalClicks 
              }))
            : [],
          deviceTypes: Array.isArray(response.data.deviceTypes)
            ? response.data.deviceTypes.map(device => ({
                deviceName: device,
                uniqueClicks: response.data.totalClicks 
              }))
            : []
        };

        setStats(transformedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (urlId) {
      fetchStats();
    }
  }, [urlId]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 p-4 rounded-lg">
      <p className="text-red-700">{error}</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">URL Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-sm font-medium text-blue-900">Total Clicks</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalClicks}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <h3 className="text-sm font-medium text-green-900">Unique Users</h3>
          <p className="text-2xl font-bold text-green-600">{stats.uniqueUsers}</p>
        </div>
      </div>

      {/* Clicks Over Time Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Clicks Over Time</h3>
        <div className="h-64">
          {stats.clicksByDate && stats.clicksByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.clicksByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#4f46e5" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              No click data available
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OS Distribution */}
        <div>
          <h3 className="text-lg font-medium mb-4">Operating Systems</h3>
          <div className="h-64">
            {stats.osType && stats.osType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.osType}
                    dataKey="uniqueClicks"
                    nameKey="osName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {stats.osType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                No OS data available
              </div>
            )}
          </div>
        </div>

        {/* Device Types Distribution */}
        <div>
          <h3 className="text-lg font-medium mb-4">Device Types</h3>
          <div className="h-64">
            {stats.deviceTypes && stats.deviceTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.deviceTypes}
                    dataKey="uniqueClicks"
                    nameKey="deviceName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {stats.deviceTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                No device data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLStats;