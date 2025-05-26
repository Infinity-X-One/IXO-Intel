import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export const generatePrediction = async (asset: string, marketData: string, botContext: string) => {
  const prompt = `
    You are a financial prediction AI assistant. 
    Based on the following market data for ${asset}:
    
    ${marketData}
    
    And considering your role and expertise as described:
    ${botContext}
    
    Generate a prediction with the following information:
    1. Predicted direction (UP, DOWN, NEUTRAL)
    2. Confidence score (0.0-1.0)
    3. Risk score (0.0-1.0)
    4. A brief reason for this prediction (2-3 sentences)
    
    Format your response as a JSON object with the following structure:
    {
      "predicted_direction": "UP|DOWN|NEUTRAL",
      "confidence_score": 0.XX,
      "risk_score": 0.XX,
      "reason_summary": "Your reasoning here"
    }
  `

  try {
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.2,
      maxTokens: 500,
    })

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    throw new Error("Failed to parse prediction JSON from response")
  } catch (error) {
    console.error("Error generating prediction:", error)
    throw error
  }
}
