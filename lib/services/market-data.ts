import { API_CONFIG, API_ENDPOINTS } from "@/lib/config/api-keys"

export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
  source: string
}

export interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  sentiment?: "positive" | "negative" | "neutral"
}

// Rate limiting cache
const apiCallCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 60000 // 1 minute cache
const RATE_LIMIT_DELAY = 1000 // 1 second between calls

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to check cache
function getCachedData(key: string) {
  const cached = apiCallCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

// Helper function to set cache
function setCachedData(key: string, data: any) {
  apiCallCache.set(key, { data, timestamp: Date.now() })
}

// Generate realistic demo data
function generateDemoStockData(symbol: string): MarketData {
  const basePrice = Math.random() * 200 + 50
  const change = (Math.random() - 0.5) * 20
  const changePercent = (change / basePrice) * 100

  return {
    symbol: symbol.toUpperCase(),
    price: Number.parseFloat(basePrice.toFixed(2)),
    change: Number.parseFloat(change.toFixed(2)),
    changePercent: Number.parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000),
    timestamp: new Date().toISOString(),
    source: "Demo Data",
  }
}

function generateDemoCryptoData(symbol: string): MarketData {
  const cryptoPrices: { [key: string]: number } = {
    btc: 45000,
    bitcoin: 45000,
    eth: 2800,
    ethereum: 2800,
    ada: 0.45,
    cardano: 0.45,
    sol: 95,
    solana: 95,
    bnb: 320,
    xrp: 0.55,
    doge: 0.08,
    matic: 0.85,
    dot: 6.5,
    avax: 38,
  }

  const basePrice = cryptoPrices[symbol.toLowerCase()] || Math.random() * 1000 + 100
  const change = (Math.random() - 0.5) * (basePrice * 0.1)
  const changePercent = (change / basePrice) * 100

  return {
    symbol: symbol.toUpperCase(),
    price: Number.parseFloat(basePrice.toFixed(2)),
    change: Number.parseFloat(change.toFixed(2)),
    changePercent: Number.parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 50000000),
    timestamp: new Date().toISOString(),
    source: "Demo Data",
  }
}

// Real-time stock data using Alpha Vantage with rate limiting
export async function getStockPrice(symbol: string): Promise<MarketData> {
  const cacheKey = `stock_${symbol}`
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    // Add delay to prevent rate limiting
    await delay(RATE_LIMIT_DELAY)

    if (!API_CONFIG.ALPHA_VANTAGE_API_KEY) {
      console.log("No Alpha Vantage API key, using demo data")
      return generateDemoStockData(symbol)
    }

    const response = await fetch(
      `${API_ENDPOINTS.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE_API_KEY}`,
      {
        headers: {
          "User-Agent": "InfinityXOne/1.0",
        },
      },
    )

    if (!response.ok) {
      if (response.status === 429) {
        console.log("Rate limited by Alpha Vantage, using demo data")
        return generateDemoStockData(symbol)
      }
      throw new Error(`Failed to fetch stock data: ${response.status}`)
    }

    const data = await response.json()

    // Check for API limit messages
    if (data.Note || data.Information) {
      console.log("Alpha Vantage API limit reached, using demo data")
      return generateDemoStockData(symbol)
    }

    // Check if we have valid data
    if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
      console.log(`No data found for symbol: ${symbol}, using demo data`)
      return generateDemoStockData(symbol)
    }

    const quote = data["Global Quote"]
    const result = {
      symbol: quote["01. symbol"] || symbol,
      price: Number.parseFloat(quote["05. price"] || "0"),
      change: Number.parseFloat(quote["09. change"] || "0"),
      changePercent: Number.parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
      volume: Number.parseInt(quote["06. volume"] || "0"),
      timestamp: quote["07. latest trading day"] || new Date().toISOString(),
      source: "Alpha Vantage",
    }

    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching stock price:", error)
    return generateDemoStockData(symbol)
  }
}

// Real-time crypto data with enhanced rate limiting
export async function getCryptoPrice(symbol: string): Promise<MarketData> {
  const cacheKey = `crypto_${symbol}`
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    // Add delay to prevent rate limiting
    await delay(RATE_LIMIT_DELAY * 2) // Longer delay for crypto APIs

    // Map common crypto symbols to CoinGecko IDs
    const cryptoMap: { [key: string]: string } = {
      btc: "bitcoin",
      bitcoin: "bitcoin",
      eth: "ethereum",
      ethereum: "ethereum",
      ada: "cardano",
      cardano: "cardano",
      sol: "solana",
      solana: "solana",
      bnb: "binancecoin",
      binancecoin: "binancecoin",
      xrp: "ripple",
      ripple: "ripple",
      doge: "dogecoin",
      dogecoin: "dogecoin",
      matic: "matic-network",
      polygon: "matic-network",
      dot: "polkadot",
      polkadot: "polkadot",
      avax: "avalanche-2",
      avalanche: "avalanche-2",
    }

    const coinId = cryptoMap[symbol.toLowerCase()] || symbol.toLowerCase()

    // Use demo data if no API key
    if (!API_CONFIG.COINGECKO_API_KEY) {
      console.log("No CoinGecko API key, using demo data")
      return generateDemoCryptoData(symbol)
    }

    const response = await fetch(
      `${API_ENDPOINTS.COINGECKO}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
      {
        headers: {
          "x-cg-demo-api-key": API_CONFIG.COINGECKO_API_KEY,
          "User-Agent": "InfinityXOne/1.0",
        },
      },
    )

    if (!response.ok) {
      if (response.status === 429) {
        console.log("Rate limited by CoinGecko, using demo data")
        return generateDemoCryptoData(symbol)
      }
      throw new Error(`Failed to fetch crypto data: ${response.status}`)
    }

    const data = await response.json()

    // Check if we have valid data
    if (!data[coinId]) {
      console.log(`No data found for crypto: ${symbol} (${coinId}), using demo data`)
      return generateDemoCryptoData(symbol)
    }

    const coinData = data[coinId]
    const result = {
      symbol: symbol.toUpperCase(),
      price: coinData.usd || 0,
      change: coinData.usd_24h_change || 0,
      changePercent: coinData.usd_24h_change || 0,
      volume: coinData.usd_24h_vol || 0,
      timestamp: new Date().toISOString(),
      source: "CoinGecko",
    }

    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching crypto price:", error)
    return generateDemoCryptoData(symbol)
  }
}

// Get financial news with rate limiting
export async function getFinancialNews(query = "finance", limit = 10): Promise<NewsItem[]> {
  const cacheKey = `news_${query}_${limit}`
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    await delay(RATE_LIMIT_DELAY)

    if (!API_CONFIG.NEWS_API_KEY) {
      console.log("No News API key, using demo data")
      return generateDemoNews()
    }

    const response = await fetch(
      `${API_ENDPOINTS.NEWS_API}/everything?q=${query}&sortBy=publishedAt&pageSize=${limit}&apiKey=${API_CONFIG.NEWS_API_KEY}`,
    )

    if (!response.ok) {
      if (response.status === 429) {
        console.log("Rate limited by News API, using demo data")
        return generateDemoNews()
      }
      throw new Error(`Failed to fetch news: ${response.status}`)
    }

    const data = await response.json()

    if (!data.articles || !Array.isArray(data.articles)) {
      return generateDemoNews()
    }

    const result = data.articles.map((article: any) => ({
      title: article.title || "No title",
      description: article.description || "No description",
      url: article.url || "#",
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || "Unknown",
    }))

    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching news:", error)
    return generateDemoNews()
  }
}

function generateDemoNews(): NewsItem[] {
  return [
    {
      title: "AI Prediction Markets Show Strong Growth",
      description:
        "Artificial intelligence-powered prediction platforms are gaining traction among institutional investors.",
      url: "#",
      publishedAt: new Date().toISOString(),
      source: "Demo Financial News",
    },
    {
      title: "Cryptocurrency Market Analysis: Q1 2024",
      description: "Bitcoin and Ethereum continue to show resilience despite market volatility.",
      url: "#",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: "Demo Crypto News",
    },
    {
      title: "Tech Stocks Rally on AI Innovation",
      description: "Major technology companies report strong earnings driven by AI product adoption.",
      url: "#",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: "Demo Tech News",
    },
  ]
}

// Get market data for multiple assets with better rate limiting
export async function getMultipleAssetPrices(symbols: string[]): Promise<MarketData[]> {
  const results: MarketData[] = []

  // Process symbols in smaller batches to avoid rate limits
  const batchSize = 3
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize)

    const batchPromises = batch.map(async (symbol, index) => {
      try {
        // Add progressive delay for each symbol in batch
        await delay(index * 500)

        // Determine if it's crypto or stock based on symbol
        const cryptoSymbols = [
          "btc",
          "bitcoin",
          "eth",
          "ethereum",
          "ada",
          "cardano",
          "sol",
          "solana",
          "bnb",
          "xrp",
          "doge",
          "matic",
          "dot",
          "avax",
        ]

        if (cryptoSymbols.some((crypto) => symbol.toLowerCase().includes(crypto))) {
          return await getCryptoPrice(symbol.toLowerCase())
        } else {
          return await getStockPrice(symbol)
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error)
        // Return demo data for failed requests
        const cryptoSymbols = [
          "btc",
          "bitcoin",
          "eth",
          "ethereum",
          "ada",
          "cardano",
          "sol",
          "solana",
          "bnb",
          "xrp",
          "doge",
          "matic",
          "dot",
          "avax",
        ]
        return cryptoSymbols.some((crypto) => symbol.toLowerCase().includes(crypto))
          ? generateDemoCryptoData(symbol)
          : generateDemoStockData(symbol)
      }
    })

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Add delay between batches
    if (i + batchSize < symbols.length) {
      await delay(2000) // 2 second delay between batches
    }
  }

  return results.filter((result): result is MarketData => result !== null)
}
