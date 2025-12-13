/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL||"https://social-circle-eight.vercel.app/",
  generateRobotsTxt: true, // (optional)
  changefreq: "daily", // (optional)
  priority: 0.7, // (optional)
  sitemapSize: 7000, // (optional)
  exclude: ["/404", "/500"], // (optional)
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", disallow: "/private" },
    ],
  },
};