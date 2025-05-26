// API Configuration - Add these to your environment variables
export const API_CONFIG = {
  // Financial Data APIs
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
  POLYGON_API_KEY: process.env.POLYGON_API_KEY,
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
  TWELVE_DATA_API_KEY: process.env.TWELVE_DATA_API_KEY,

  // Crypto APIs
  COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
  BINANCE_API_KEY: process.env.BINANCE_API_KEY,
  BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY,

  // News APIs
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  NEWSDATA_API_KEY: process.env.NEWSDATA_API_KEY,

  // Web Scraping
  APIFY_API_KEY: process.env.APIFY_API_KEY,
  SCRAPFLY_API_KEY: process.env.SCRAPFLY_API_KEY,

  // AI Services (already configured)
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Email Services
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,

  // Webhook Services
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
}

// API Base URLs
export const API_ENDPOINTS = {
  ALPHA_VANTAGE: "https://www.alphavantage.co/query",
  POLYGON: "https://api.polygon.io",
  FINNHUB: "https://finnhub.io/api/v1",
  TWELVE_DATA: "https://api.twelvedata.com",
  COINMARKETCAP: "https://pro-api.coinmarketcap.com/v1",
  COINGECKO: "https://api.coingecko.com/api/v3",
  BINANCE: "https://api.binance.com/api/v3",
  NEWS_API: "https://newsapi.org/v2",
  NEWSDATA: "https://newsdata.io/api/1",
}
