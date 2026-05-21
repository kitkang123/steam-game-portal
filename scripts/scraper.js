import axios from 'axios';
import * as cheerio from 'cheerio';

const STEAM_SEARCH_URL = 'https://store.steampowered.com/search/?filter=topsellers&cc=us&l=english';

export async function scrapeTop5() {
  console.log('Fetching Steam Top Sellers page...');
  
  try {
    const { data } = await axios.get(STEAM_SEARCH_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const $ = cheerio.load(data);
    const games = [];

    // Loop through search result rows
    $('.search_result_row').each((index, element) => {
      if (games.length >= 5) return false; // Break after top 5

      const row = $(element);
      const title = row.find('.title').text().trim();
      const href = row.attr('href') || '';
      
      // Parse AppID
      let appid = row.attr('data-ds-appid') || '';
      // If data-ds-appid contains multiple appids (e.g., packages), take the first one
      if (appid.includes(',')) {
        appid = appid.split(',')[0];
      }

      // If appid is still empty, parse from URL
      if (!appid && href) {
        const match = href.match(/\/app\/(\d+)/);
        if (match) appid = match[1];
      }

      // Image URL (Steam capsule header is clean and standard)
      const imageUrl = appid 
        ? `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg` 
        : row.find('.search_capsule img').attr('src') || '';

      // Price parsing
      let originalPrice = '';
      let currentPrice = 'Free';
      let discountPercent = '';

      const discountDiv = row.find('.search_discount span');
      if (discountDiv.length > 0) {
        discountPercent = discountDiv.text().trim(); // e.g. -20%
      }

      const priceDiv = row.find('.search_price');
      if (priceDiv.length > 0) {
        if (priceDiv.hasClass('discounted')) {
          originalPrice = priceDiv.find('span strike').text().trim();
          // Remove the strike content to get the discounted price
          const priceText = priceDiv.text().replace(originalPrice, '').trim();
          currentPrice = priceText || 'Free';
        } else {
          currentPrice = priceDiv.text().trim() || 'Free';
        }
      }

      if (title && appid) {
        games.push({
          rank: index + 1,
          appid,
          title,
          url: href.split('?')[0], // Clean query parameters from URL
          imageUrl,
          originalPrice,
          currentPrice,
          discountPercent,
        });
      }
    });

    console.log(`Successfully scraped ${games.length} games:`);
    games.forEach(g => console.log(`  #${g.rank}: ${g.title} (AppID: ${g.appid}, Price: ${g.currentPrice})`));
    
    return games;
  } catch (error) {
    console.error('Error scraping Steam top sellers:', error.message);
    throw error;
  }
}

// Run immediately if executed directly
if (process.argv[1] && process.argv[1].endsWith('scraper.js')) {
  scrapeTop5().catch(() => process.exit(1));
}
