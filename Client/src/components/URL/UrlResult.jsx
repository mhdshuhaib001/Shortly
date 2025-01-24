import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UrlResult = ({ shortUrl, longUrl, urlId }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error("Failed to copy URL:", err);
    }
  };
  const viewStats = () => {
    navigate(`/stats/${urlId}`);
  };

  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        URL Shortened Successfully!
      </h3>

      <div className="space-y-3">
        <div>
          <div className="text-sm text-gray-600 mb-1">Original URL:</div>
          <div className="text-gray-800 truncate">{longUrl}</div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Shortened URL:</div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="flex-1 p-2 bg-white border rounded-md text-gray-800"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-md border bg-white"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <button
          onClick={viewStats}
          className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          View Statistics
        </button>
      </div>
    </div>
  );
};

export default UrlResult;
