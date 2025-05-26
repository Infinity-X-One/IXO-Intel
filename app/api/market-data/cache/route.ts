import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getMultipleAssetPrices } from "@/lib/services/market-data"

// GET cached market data with enhanced caching
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")?.split(",") || []
    const maxAge = Number.parseInt(searchParams.get("maxAge") || "600") // 10 minutes default (increased)

    const supabase = createServerSupabaseClient()

    if (symbols.length === 0) {
      // Return all recent market data
      const { data, error } = await supabase
        .from("market_data_cache")
        .select("*")
        .gte("timestamp", new Date(Date.now() - maxAge * 1000).toISOString())
        .order("timestamp", { ascending: false })

      if (error) throw error
      return NextResponse.json(data || [])
    }

    // Get specific symbols from cache first
    const { data: cachedData, error } = await supabase
      .from("market_data_cache")
      .select("*")
      .in(
        "symbol",
        symbols.map((s) => s.toUpperCase()),
      )
      .gte("timestamp", new Date(Date.now() - maxAge * 1000).toISOString())

    if (error) {
      console.error("Database error:", error)
      // If database fails, fetch fresh data
      const freshData = await getMultipleAssetPrices(symbols)
      return NextResponse.json(freshData)
    }

    const cachedSymbols = (cachedData || []).map((item) => item.symbol)
    const missingSymbols = symbols.filter((symbol) => !cachedSymbols.includes(symbol.toUpperCase()))

    // Only fetch missing data if we have less than half cached
    let freshData: any[] = []
    if (missingSymbols.length > 0 && missingSymbols.length <= 5) {
      // Limit to 5 symbols max
      try {
        console.log(`Fetching fresh data for: ${missingSymbols.join(", ")}`)
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

          const { error: insertError } = await supabase.from("market_data_cache").upsert(cacheInserts, {
            onConflict: "symbol,source",
          })

          if (insertError) {
            console.error("Error caching data:", insertError)
          }
        }
      } catch (error) {
        console.error("Error fetching fresh market data:", error)
        // Continue with cached data only
      }
    }

    // Combine cached and fresh data
    const allData = [
      ...(cachedData || []).map((item) => ({
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
    console.error("Error in market data cache API:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}

// POST to manually refresh cache (with rate limiting)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { symbols } = body

    if (!symbols || !Array.isArray(symbols) || symbols.length > 10) {
      return NextResponse.json(
        {
          error: "Symbols array is required (max 10 symbols)",
        },
        { status: 400 },
      )
    }

    console.log(`Manual refresh requested for: ${symbols.join(", ")}`)
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

      if (error) {
        console.error("Error caching refreshed data:", error)
      }
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
