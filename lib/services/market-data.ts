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

// Real-time stock data using Alpha Vantage
export async function getStockPrice(symbol: string): Promise<MarketData> {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE_API_KEY}`,
    )

    if (!response.ok) throw new Error(`Failed to fetch stock data: ${response.status}`)

    const data = await response.json()

    // Check if we have valid data
    if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
      throw new Error(`No data found for symbol: ${symbol}`)
    }

    const quote = data["Global Quote"]

    return {
      symbol: quote["01. symbol"] || symbol,
      price: Number.parseFloat(quote["05. price"] || "0"),
      change: Number.parseFloat(quote["09. change"] || "0"),
      changePercent: Number.parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
      volume: Number.parseInt(quote["06. volume"] || "0"),
      timestamp: quote["07. latest trading day"] || new Date().toISOString(),
      source: "Alpha Vantage",
    }
  } catch (error) {
    console.error("Error fetching stock price:", error)
    // Return mock data for demo purposes
    return {
      symbol: symbol,
      price: Math.random() * 100 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      source: "Demo Data",
    }
  }
}

// Real-time crypto data using CoinGecko
export async function getCryptoPrice(symbol: string): Promise<MarketData> {
  try {
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

    const response = await fetch(
      `${API_ENDPOINTS.COINGECKO}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
      {
        headers: {
          "x-cg-demo-api-key": API_CONFIG.COINGECKO_API_KEY || "",
        },
      },
    )

    if (!response.ok) throw new Error(`Failed to fetch crypto data: ${response.status}`)

    const data = await response.json()

    // Check if we have valid data
    if (!data[coinId]) {
      throw new Error(`No data found for crypto: ${symbol} (${coinId})`)
    }

    const coinData = data[coinId]

    return {
      symbol: symbol.toUpperCase(),
      price: coinData.usd || 0,
      change: coinData.usd_24h_change || 0,
      changePercent: coinData.usd_24h_change || 0,
      volume: coinData.usd_24h_vol || 0,
      timestamp: new Date().toISOString(),
      source: "CoinGecko",
    }
  } catch (error) {
    console.error("Error fetching crypto price:", error)
    // Return mock data for demo purposes
    return {
      symbol: symbol.toUpperCase(),
      price: Math.random() * 1000 + 100,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 10000000),
      timestamp: new Date().toISOString(),
      source: "Demo Data",
    }
  }
}

// Get financial news using NewsAPI
export async function getFinancialNews(query = "finance", limit = 10): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.NEWS_API}/everything?q=${query}&sortBy=publishedAt&pageSize=${limit}&apiKey=${API_CONFIG.NEWS_API_KEY}`,
    )

    if (!response.ok) throw new Error(`Failed to fetch news: ${response.status}`)

    const data = await response.json()

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error("Invalid news API response")
    }

    return data.articles.map((article: any) => ({
      title: article.title || "No title",
      description: article.description || "No description",
      url: article.url || "#",
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || "Unknown",
    }))
  } catch (error) {
    console.error("Error fetching news:", error)
    // Return mock news for demo purposes
    return [
      {
        title: "Market Analysis: Tech Stocks Show Strong Performance",
        description: "Technology stocks continue to outperform market expectations with strong quarterly results.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Demo News",
      },
      {
        title: "Cryptocurrency Market Update",
        description: "Bitcoin and Ethereum show positive momentum as institutional adoption increases.",
        url: "#",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: "Demo News",
      },
    ]
  }
}

// Get market data for multiple assets
export async function getMultipleAssetPrices(symbols: string[]): Promise<MarketData[]> {
  const promises = symbols.map(async (symbol) => {
    try {
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
      // Return mock data instead of null
      return {
        symbol: symbol.toUpperCase(),
        price: Math.random() * 100 + 50,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
        source: "Demo Data",
      }
    }
  })

  const results = await Promise.all(promises)
  return results.filter((result): result is MarketData => result !== null)
}
