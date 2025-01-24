import React, { useState } from "react";
import apiService from "../../service/api";
import UrlResult from "./UrlResult";

const CreateURL = () => {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [urlData, setUrlData] = useState(null);

  const validateUrl = (url) => {
    const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!longUrl || !validateUrl(longUrl)) {
      setError("Please enter a valid URL.");
      return;
    }

    if (customAlias && !/^[a-zA-Z0-9_-]+$/.test(customAlias)) {
      setError("Custom alias can only contain letters, numbers, hyphens, and underscores.");
      return;
    }

    if (!topic) {
      setError("Please select a topic.");
      return;
    }

    try {
      const response = await apiService.urls.create({
        longUrl,
        customAlias,
        topic,
      });
      setUrlData({
        shortUrl: response.shortUrl,
        longUrl,
        urlId: response.urlId,
      });
      setLongUrl("");
      setCustomAlias("");
      setTopic("");

    } catch (error) {
      setError(error.response?.data?.error || "Failed to create short URL");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Short URL</h2>

      {error && (
        <div className="mb-4 p-4 text-red-500 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 text-teal-500 bg-teal-100 rounded-md">
          {success}
        </div>
      )}

      {urlData ? (
        <UrlResult
          shortUrl={urlData.shortUrl}
          longUrl={urlData.longUrl}
          urlId={urlData.urlId}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Long URL</label>
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Custom Alias (optional)</label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              placeholder="my-custom-url"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="">Select a topic</option>
              <option value="acquisition">Acquisition</option>
              <option value="activation">Activation</option>
              <option value="retention">Retention</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Create Short URL
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateURL;
