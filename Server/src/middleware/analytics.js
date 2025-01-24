import Analytics from "../models/Analytics.js";
import useragent from "express-useragent";
import geoip from "geoip-lite";
import URL from "../models/URL.js";

const trackAnalytics = async (req, res, next) => {
  try {

    const { shortUrl } = req.params;
    const urlRecord = await URL.findOne({ shortUrl });

    const userAgent = useragent.parse(req.headers["user-agent"]);
    const ip = req.ip || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);

    if(!urlRecord){
      return res.status(404).json({error:'Short Url Is Not Found'})
    }
    const analytics = new Analytics({
      urlId: urlRecord._id,
      userAgent: req.headers["user-agent"],
      ipAddress: ip,
      country: geo?.country,
      city: geo?.city,
      osType: userAgent.os,
      deviceType: userAgent.isMobile ? "mobile" : "desktop",
      browser: userAgent.browser,
      referrer: req.headers.referer || "",
      uniqueVisitorId: req.headers["x-forwarded-for"] || ip
    });

    await analytics.save();
    next();
  } catch (error) {
    console.error("Analytics Error:", error);
    next();
  }
};

export default trackAnalytics
