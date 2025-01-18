import URL from "../models/URL.js";
import Analytics from "../models/Analytics.js";

const analyticsController = {
  getURLAnalytics: async (req, res) => {
    try {
      const { urlId } = req.params;

      const url = await URL.findById(urlId);

      if (!url || url.userId.toString() != req.user.userId) {
        return res.status(404).json({ error: "URL not found" });
      }

      // Aggregate analytics for the given URL
      const analytics = await Analytics.aggregate([
        { $match: { urlId: url._id } },
        {
          $group: {
            _id: null,
            totalClicks: { $sum: 1 },
            uniqueUsers: { $addToSet: "$uniqueVisitorId" },
            osType: { $addToSet: "$osType" },
            deviceTypes: { $addToSet: "$deviceType" }
          }
        }
      ]);

      // Aggregate click counts by date for the given URL 7 days of count 
      const clicksByDate = await Analytics.aggregate([
        { $match: { urlId: url._id } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ]);

      res.json({
        totalClicks: analytics[0]?.totalClicks || 0,
        uniqueUsers: analytics[0]?.uniqueUsers.length || 0,
        clicksByDate: clicksByDate.map((item) => ({
          date: item._id,
          clicks: item.clicks
        })),
        osType: analytics[0]?.osTypes || [],
        deviceTypes: analytics[0]?.deviceTypes || []
      });
    } catch (error) {
      console.error("Analytics Error:", error);
      res.status(500).json({ error: "Error fetching analytics" });
    }
  },

  getTopicAnalytics: async (req, res) => {
    try {
      const { topic } = req.params;
      const urls = await URL.find({ userId: req.user.userId, topic });
      const urlIds = urls.map((url) => url._id);

      const analytics = await Analytics.aggregate([
        { $match: { urlId: { $in: urlIds } } },
        {
          $group: {
            _id: "$urlId",
            clicks: { $sum: 1 },
            uniqueUsers: { $addToSet: "$uniqueVisitorId" }
          }
        }
      ]);

      console.log(analytics, "the analytics");

      const urlStats = urls.map((url) => {
        const urlAnalytics = analytics.find((a) => a._id.equals(url._id)) || {};
        return {
          shortUrl: url.shortUrl,
          totalClicks: urlAnalytics.clicks || 0,
          uniqueUsers: urlAnalytics.uniqueUsers?.length || 0
        };
      });

      res.json({
        topic,
        totalUrls: urls.length,
        totalClicks: analytics.reduce((sum, a) => sum + a.clicks, 0),
        uniqueUsers: new Set(analytics.flatMap((a) => a.uniqueUsers)).size,
        urls: urlStats
      });
    } catch (error) {
      console.error("Topic Analytics Error", error);
      res.status(500).json({ error: "Error fetching topic analytics" });
    }
  }
};

export default analyticsController;
