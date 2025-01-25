import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import PaginationControls from './PaginationControls';

const UrlsTable = ({ urls, pagination, onPageChange, selectedTopic, onTopicChange }) => {
  return (
    <div className="bg-white rounded-lg shadow">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">Your URLs</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="all">All Topics</option>
            <option value="acquisition">Acquisition</option>
            <option value="activation">Activation</option>
            <option value="retention">Retention</option>
          </select>
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600"
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
          {urls.map((url) => (
            <tr key={url._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:text-teal-700"
                  >
                    {url.shortUrl.split("/").pop()}
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
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
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
                  className="text-teal-500 hover:text-teal-700 mr-4"
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
      <PaginationControls pagination={pagination} onPageChange={onPageChange} />
    </div>
  </div>
  )
};

export default UrlsTable;
