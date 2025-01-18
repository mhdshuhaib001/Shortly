import URL from "../models/URL.js";
import shortid from "shortid";
import redis from "../config/redis.js";

const urlController = {
  isValidUrl: (url) => {
    try {
      const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      return regex.test(url);
    } catch (error) {
      return false;
    }
  },
  createShortURL: async (req, res) => {
    try {
      const { longUrl, customAlias, topic } = req.body;
      const userId = req.user.userId;

      if (!urlController.isValidUrl(longUrl)) {
        return res.status(400).json({ error: "Invalid Url Format" });
      }

      let shortUrl = customAlias;
      if (customAlias) {
        const existingUrl = await URL.findOne({ shortUrl: customAlias });
        if (existingUrl) {
          return res.status(400).json({ error: "Custom alias already in use" });
        }
      } else {
        shortUrl = shortid.generate();
      }

      console.log(shortUrl, "thisi is the shortUrl");
      const url = await URL.create({
        userId,
        longUrl,
        shortUrl,
        topic: topic || "general"
      });

      console.log(url, "this is the userl");
      // cashing new url for the 24 hr
      await redis.set(`url:${shortUrl}`, longUrl, "EX", 86400);

      res.status(201).json({
        urlId: url._id,
        shortUrl: `${process.env.BASE_URL}/api/url/${shortUrl}`,
        longUrl,
        topic,
        createdAt: url.createdAt
      });
    } catch (error) {
      console.error("URL Creation Error:", error);
      res.status(500).json({ error: "Error creating short URL" });
    }
  },

  redirectToLongUrl: async (req, res) => {
    try {
      const { shortUrl } = req.params;
      const cachedUrl = await redis.get(`url:${shortUrl}`);
      if (cachedUrl) {
        return res.redirect(cachedUrl);
      }
      const url = await URL.findOne({ shortUrl: shortUrl });
      if (!url) {
        return res.status(404).json({ error: "Url not found" });
      }
      url.clicks += 1;
      await url.save();
      // Cache the URL for 24 hours
      await redis.set(`url:${shortUrl}`, url.longUrl, "EX", 86400);

      res.redirect(url.longUrl);
    } catch (error) {
      console.error("Redirect Error:", error);
      res.status(500).json({ error: "Error redirecting to URL" });
    }
  }
};

export default urlController;
