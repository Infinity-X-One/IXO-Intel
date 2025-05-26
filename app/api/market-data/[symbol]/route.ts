import { NextResponse } from "next/server"
import { getStockPrice, getCryptoPrice } from "@/lib/services/market-data"

export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "auto"

    let marketData

    if (type === "crypto") {
      marketData = await getCryptoPrice(symbol.toLowerCase())
    } else if (type === "stock") {
      marketData = await getStockPrice(symbol.toUpperCase())
    } else {
      // Auto-detect based on symbol
      try {
        marketData = await getStockPrice(symbol.toUpperCase())
      } catch {
        marketData = await getCryptoPrice(symbol.toLowerCase())
      }
    }

    return NextResponse.json(marketData)
  } catch (error) {
    console.error("Error fetching market data:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
