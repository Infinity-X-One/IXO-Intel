export interface AgenticBot {
  id: string
  name: string
  description: string | null
  role: string | null
  skills: string[] | null
  confidence_level: string | null
  created_by: string
  created_at: string
  active: boolean
}

export interface BotKnowledge {
  id: string
  bot_id: string
  file_name: string | null
  file_type: string | null
  url: string | null
  summary: string | null
  uploaded_at: string
}

export interface Prediction {
  id: string
  asset: string
  signal_type: string | null
  predicted_direction: string | null
  confidence_score: number | null
  risk_score: number | null
  reason_summary: string | null
  prediction_timestamp: string
  prediction_made_by: string | null
  outcome: string | null
  accuracy: number | null
  delta_error: number | null
}

export interface SystemLog {
  id: string
  event_type: string | null
  related_bot: string | null
  severity: string | null
  message: string | null
  detected_at: string
}

export interface TradeTracking {
  id: string
  prediction_id: string | null
  asset: string | null
  entry_price: number | null
  exit_price: number | null
  pnl: number | null
  trade_timestamp: string
  reason_for_entry: string | null
  reason_for_exit: string | null
}
