import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getMultipleAssetPrices } from "@/lib/services/market-data"

// GET cached market data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")?.split(",") || []
    const maxAge = Number.parseInt(searchParams.get("maxAge") || "300") // 5 minutes default

    const supabase = createServerSupabaseClient()

    if (symbols.length === 0) {
      // Return all recent market data
      const { data, error } = await supabase
        .from("market_data_cache")
        .select("*")
        .gte("timestamp", new Date(Date.now() - maxAge * 1000).toISOString())
        .order("timestamp", { ascending: false })

      if (error) throw error
      return NextResponse.json(data)
    }

    // Get specific symbols
    const { data: cachedData, error } = await supabase
      .from("market_data_cache")
      .select("*")
      .in("symbol", symbols)
      .gte("timestamp", new Date(Date.now() - maxAge * 1000).toISOString())

    if (error) throw error

    const cachedSymbols = cachedData.map((item) => item.symbol)
    const missingSymbols = symbols.filter((symbol) => !cachedSymbols.includes(symbol))

    // Fetch missing data from external APIs
    let freshData = []
    if (missingSymbols.length > 0) {
      try {
        freshData = await getMultipleAssetPrices(missingSymbols)

        // Cache the fresh data
        if (freshData.length > 0) {
          const cacheInserts = freshData.map((data) => ({
            symbol: data.symbol,
            price: data.price,
            change_amount: data.change,
            change_percent: data.changePercent,
            volume: data.volume,
            source: data.source,
          }))

          await supabase.from("market_data_cache").upsert(cacheInserts, {
            onConflict: "symbol,source",
          })
        }
      } catch (error) {
        console.error("Error fetching fresh market data:", error)
      }
    }

    // Combine cached and fresh data
    const allData = [
      ...cachedData.map((item) => ({
        symbol: item.symbol,
        price: Number.parseFloat(item.price),
        change: Number.parseFloat(item.change_amount || "0"),
        changePercent: Number.parseFloat(item.change_percent || "0"),
        volume: item.volume,
        timestamp: item.timestamp,
        source: item.source,
      })),
      ...freshData,
    ]

    return NextResponse.json(allData)
  } catch (error) {
    console.error("Error fetching market data cache:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}

// POST to manually refresh cache
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { symbols } = body

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ error: "Symbols array is required" }, { status: 400 })
    }

    const freshData = await getMultipleAssetPrices(symbols)
    const supabase = createServerSupabaseClient()

    if (freshData.length > 0) {
      const cacheInserts = freshData.map((data) => ({
        symbol: data.symbol,
        price: data.price,
        change_amount: data.change,
        change_percent: data.changePercent,
        volume: data.volume,
        source: data.source,
      }))

      const { error } = await supabase.from("market_data_cache").upsert(cacheInserts, {
        onConflict: "symbol,source",
      })

      if (error) throw error
    }

    return NextResponse.json({
      success: true,
      updated: freshData.length,
      data: freshData,
    })
  } catch (error) {
    console.error("Error refreshing market data cache:", error)
    return NextResponse.json({ error: "Failed to refresh cache" }, { status: 500 })
  }
}
