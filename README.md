This is a simple inventory app that uses LLMs to interpret and execute commands.

## 1. Audio Transcription Service

This service uses OpenAI's Whisper model to transcribe audio files into text.

## 2. Text Preprocessing Service

This service preprocesses text commands.
Helps us extract intent and entities.

Example Input:

```
Text: "So, we have 5 bags of coffee beans, 2 bags of tea, and 1 bag of sugar."
```

Example Output:

```

```

## 3. Text Interpretation Service

This service uses OpenAI's GPT-4 model to interpret text and generate crud commands for the database.

Example Input:

```
Command: "We have 5 bags of coffee beans"
```

Example Output:

```
{
  "operation": "create", // "create", "update", "delete"
  "entity": "inventoryCounts", // "inventoryCounts", "items", "vendors", "users"
  "data": {
    "itemId": number,
    "count": number,
    "userId": number
  }
}

```

## 4. Command Validation Service

This service validates text commands.

## 5. Command Execution Service

This service uses OpenAI's GPT-4 model to execute text commands.

## 6. Response Generation Service

This service uses OpenAI's GPT-4 model to generate responses to text commands.
