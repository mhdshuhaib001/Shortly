import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../service/api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Link2, Bookmark, Users, Activity, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [urlsResponse, statsResponse] = await Promise.all([
          apiService.urls.getList(),apiService.auth.verifyToken()
        ]);

        setUrls(urlsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUrls = selectedTopic === 'all' 
    ? urls 
    : urls.filter(url => url.topic === selectedTopic);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100">
                <Link2 className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total URLs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalUrls || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Clicks</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalClicks || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unique Visitors</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.uniqueUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Bookmark className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Topics</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalTopics || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Clicks Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.clicksByDate || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#4f46e5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {stats?.recentActivity?.slice(0, 5).map((activity, index) => (
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
        </div>

        {/* URLs Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Your URLs</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Topics</option>
                  <option value="acquisition">Acquisition</option>
                  <option value="activation">Activation</option>
                  <option value="retention">Retention</option>
                </select>
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create New URL
                </Link>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUrls.map((url) => (
                  <tr key={url._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {url.shortUrl.split('/').pop()}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="truncate max-w-xs">{url.longUrl}</span>
                        <a
                          href={url.longUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {url.topic}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {url.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/stats/${url._id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Stats
                      </Link>
                      <button
                        onClick={() => navigator.clipboard.writeText(url.shortUrl)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;