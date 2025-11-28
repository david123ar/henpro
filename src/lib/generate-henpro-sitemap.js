const fs = require("fs");
const axios = require("axios");
const { SitemapStream, streamToPromise } = require("sitemap");

const BASE_URL = "https://henpro.me"; // your website domain
const API_URL = "https://api.henpro.fun/api/episodes?page=";
const OUTPUT = "../public/sitemap-henpro.xml";

async function generateHenproSitemap() {
  try {
    console.log("Fetching page 1...");
    const first = await axios.get(API_URL + 1);

    const totalPages = first.data.totalPages || 1;
    console.log(`Total Pages Found: ${totalPages}`);

    let urls = [];

    for (let page = 1; page <= totalPages; page++) {
      console.log(`Fetching page ${page}/${totalPages}`);

      const res = await axios.get(API_URL + page);
      const episodes = res.data.data?.recentEpisodes || [];

      episodes.forEach(ep => {
        urls.push({
          url: `/watch/${ep.link}`,
          changefreq: "daily",
          priority: 0.9,
        });
      });
    }

    const sitemapStream = new SitemapStream({ hostname: BASE_URL });
    urls.forEach(u => sitemapStream.write(u));
    sitemapStream.end();

    const xml = await streamToPromise(sitemapStream);
    fs.writeFileSync(OUTPUT, xml.toString());

    console.log("✅ HenPro sitemap created:", OUTPUT);
  } catch (err) {
    console.error("❌ Error generating sitemap:", err);
  }
}

generateHenproSitemap();
