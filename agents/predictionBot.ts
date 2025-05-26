export async function runPredictionLoop(payload: any) {
  console.log("📥 FinSynapse Triggered:", payload)

  const asset = payload.asset || 'BTC'
  const prediction = Math.random() > 0.5 ? 'buy' : 'sell'
  const confidence = (Math.random() * 0.5 + 0.5).toFixed(2)

  console.log("📈 Prediction:", { asset, prediction, confidence })

  // TODO: Save to Supabase or return to frontend
}
