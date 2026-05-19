import Anthropic from "@anthropic-ai/sdk"

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe 
they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. 
The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. 
Format your response in markdown to make it easier to render to a web page
`

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function handler(event: any) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      }
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing Anthropic API key" }),
      }
    }

    const { ingredients } = JSON.parse(event.body || "{}")

    if (!ingredients) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ingredients are required" }),
      }
    }

    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `I have ${ingredients}. Please give me a recipe you'd recommend I make!`,
        },
      ],
    })

    const firstContentBlock = msg.content[0]

    if (firstContentBlock.type !== "text") {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Unexpected response format" }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        recipe: firstContentBlock.text,
      }),
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error"

    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    }
  }
}
