import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../service/api';

const CreateURL = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await apiService.urls.create({longUrl,customAlias,topic})
console.log(response.urlId,'=======================================')
      setSuccess('URL shortened successfully!');
      setLongUrl('');
      setCustomAlias('');
      setTopic('');
      
      navigate(`/stats/${response.urlId}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create short URL');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Short URL</h2>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Long URL</label>
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Custom Alias (optional)
          </label>
          <input
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="my-custom-url"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a topic</option>
            <option value="acquisition">Acquisition</option>
            <option value="activation">Activation</option>
            <option value="retention">Retention</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Short URL
        </button>
      </form>
    </div>
  );
};

export default CreateURL;