import React, { useState, useEffect } from "react";
import apiService from "../service/api";
import StatsOverview from "../components/DashBord/StatsOverview";
import ClicksChart from "../components/DashBord/ClicksChart";
import RecentActivity from "../components/DashBord/RecentActivity";
import UrlsTable from "../components/DashBord/UrlsTable";

const DashBoard = () => {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const handlePageChange = async (newPage) => {
    setLoading(true);
    try {
      const urlsResponse = await apiService.urls.getList({ 
        page: newPage, 
        limit: pagination.limit 
      });
      setUrls(urlsResponse.data);
      setPagination(urlsResponse.pagination);
    } catch (error) {
      console.error("Error changing page:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [urlsResponse, statsResponse] = await Promise.all([
          apiService.urls.getList(pagination.currentPage, pagination.limit),
          apiService.analytics.getOverall()
        ]);


        setUrls(urlsResponse.data);
        setStats(statsResponse.data);
        setPagination(urlsResponse.pagination);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const filteredUrls =
    selectedTopic === "all"
      ? urls
      : urls.filter((url) => url.topic === selectedTopic);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  console.log(stats?.recentActivity,'activities')
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsOverview stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ClicksChart data={stats?.clicksByDate || []} />
          <RecentActivity activities={stats?.recentActivity || []} />
        </div>

        <UrlsTable
          urls={filteredUrls}
          pagination={pagination}
          onPageChange={handlePageChange}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
        />
      </div>
    </div>
  );
};

export default DashBoard