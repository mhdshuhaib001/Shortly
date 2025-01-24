import URL from "../models/URL.js";
import Analytics from "../models/Analytics.js";
import mongoose from "mongoose";
const analyticsController = {
  getURLAnalytics: async (req, res) => {
    try {
      const { urlId } = req.params;
      const url = await URL.findById(urlId);

      if (!url || url.userId.toString() != req.user.userId) {
        return res.status(404).json({ error: "URL not found" });
      }

      const analytics = await Analytics.aggregate([
        { $match: { urlId: new mongoose.Types.ObjectId(url._id) } },
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

      // Aggregate click counts by date for the given URL (last 7 days)
      const clicksByDate = await Analytics.aggregate([
        { $match: { urlId: new mongoose.Types.ObjectId(url._id) } },
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
        osType: analytics[0]?.osType || [],
        deviceTypes: analytics[0]?.deviceTypes || []
      });
    } catch (error) {
      console.error("Analytics Error in controller:", error);
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
  },
  getOverallAnalytics: async (req, res) => {
    try {
      const userId = req.user.userId;
      const urls = await URL.find({ userId });
      const analytics = await Analytics.aggregate([
        { $match: { urlId: { $in: urls.map((url) => url._id) } } },
        {
          $group: {
            _id: "$deviceType",
            totalClicks: { $sum: 1 },
            uniqueUsers: { $addToSet: "$uniqueVisitorId" }
          }
        }
      ]);

      // Clicks by date (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const clicksByDate = await Analytics.aggregate([
        {
          $match: {
            urlId: { $in: urls.map((url) => url._id) },
            timestamp: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Process device type data
      const deviceTypeData = analytics.map((item) => ({
        deviceName: item._id || "Unknown",
        uniqueClicks: item.uniqueUsers.length
      }));

      const recentActivity = await Analytics.aggregate([
        { $match: { urlId: { $in: urls.map((url) => url._id) } } },
        { $sort: { timestamp: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "urls",
            localField: "urlId",
            foreignField: "_id",
            as: "urlDetails"
          }
        },
        { $unwind: "$urlDetails" },
        {
          $project: {
            action: {
              $concat: ["Link '", "$urlDetails.shortUrl", "' was clicked"]
            },
            time: {
              $let: {
                vars: {
                  now: new Date(),
                  timeDiff: { $subtract: [new Date(), "$timestamp"] }
                },
                in: {
                  $switch: {
                    branches: [
                      {
                        case: { $lt: ["$$timeDiff", 3600000] },
                        then: {
                          $concat: [
                            {
                              $toString: {
                                $floor: { $divide: ["$$timeDiff", 60000] }
                              }
                            },
                            " minutes ago"
                          ]
                        }
                      },
                      {
                        case: { $lt: ["$$timeDiff", 86400000] },
                        then: {
                          $concat: [
                            {
                              $toString: {
                                $floor: { $divide: ["$$timeDiff", 3600000] }
                              }
                            },
                            " hours ago"
                          ]
                        }
                      }
                    ],
                    default: {
                      $concat: [
                        {
                          $toString: {
                            $floor: { $divide: ["$$timeDiff", 86400000] }
                          }
                        },
                        " days ago"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      ]);
      res.json({
        totalUrls: urls.length,
        totalClicks: analytics.reduce((sum, a) => sum + a.totalClicks, 0),
        uniqueUsers: new Set(analytics.flatMap((a) => a.uniqueUsers)).size,
        clicksByDate: clicksByDate.map((item) => ({
          date: item._id,
          clicks: item.clicks
        })),
        deviceType: deviceTypeData,
        recentActivity: recentActivity
      });
    } catch (error) {
      console.error("Overall Analytics Error:", error);
      res.status(500).json({ error: "Error fetching overall analytics" });
    }
  }

};

export default analyticsController;
