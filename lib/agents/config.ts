// Configuration for your agentic system
export const AGENT_CONFIG = {
  predictionBot: {
    enabled: process.env.NODE_ENV === "production",
    maxConcurrentJobs: 5,
    retryAttempts: 3,
  },
  finsynapse: {
    apiEndpoint: process.env.FINSYNAPSE_API_URL,
    webhookSecret: process.env.FINSYNAPSE_WEBHOOK_SECRET,
  },
}
