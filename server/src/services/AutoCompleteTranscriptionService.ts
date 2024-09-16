import OpenAI from "openai";

const openai = new OpenAI();

export async function autocompleteTranscription(
  transcription: string
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant for a cafe inventory system. Your task is to autocomplete and correct the given transcription to make it more accurate and clear for inventory management purposes.",
      },
      { role: "user", content: transcription },
    ],
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content || transcription;
}
