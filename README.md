This is a simple inventory app that uses LLMs to interpret and execute commands.

## 1. Audio Transcription Service

This service uses OpenAI's Whisper model to transcribe audio files into text.

Example Input: example.wave (audio file)

Example Output: "So, we have 13 bags of avocados, we have two flats of tomatoes, we have one case of lettuce, two cases of spinach, we don't have any kale, and we have 10 gallons of whole milk."

## 2. Text Preprocessing Service

This service cleans and normalizes the text while retaining action phrases that convey the user's intent.

Helps us extract intent and entities.

Example Input:

```
Text: "So, we have 13 bags of avocados, we have two flats of tomatoes, we have one case of lettuce, two cases of spinach, we don't have any kale, and we have 10 gallons of whole milk."
```

Example Output:

```
{
  "original_text": "So, we have 13 bags of avocados, we have two flats of tomatoes, we have one case of lettuce, two cases of spinach, we don't have any kale, and we have 10 gallons of whole milk.",
  "normalized_actions": [
    {
      "action": "have",
      "quantity": 13,
      "unit": "bags",
      "item": "avocados"
   },
   {
      "action": "have",
      "quantity": 2,
      "unit": "flats",
      "item": "tomatoes"
    },
    {
      "action": "have",
      "quantity": 1,
      "unit": "case",
      "item": "lettuce"
   },
   {
      "action": "have",
      "quantity": 2,
      "unit": "cases",
      "item": "spinach"
    },
    {
      "action": "don't have any",
      "quantity": 0,
      "unit": null,
      "item": "kale"
    },
    {
      "action": "have",
      "quantity": 10,
      "unit": "gallons",
      "item": "whole milk"
    }
  ],
  "intent": "update_inventory"
}
```

## 3. Action Interpretation Service

This service uses OpenAI's GPT-4 model to map intent/actions to CRUD operations and generate crud commands for the database.

- Mapps intent/actions to CRUD operations
- Uses contextual knowledge of existing inventory data to decide whether to create a new record or update an existing one.
- Generates CRUD commands

Example Input:

```
{
  "original_text": "So, we have 13 bags of avocados, we have two flats of tomatoes, we have one case of lettuce, two cases of spinach, we don't have any kale, and we have 10 gallons of whole milk.",
  "normalized_items": [
    {action: "have", "item": "avocados", "quantity": 13, "unit": "bags"},
    {action: "have", "item": "tomatoes", "quantity": 2, "unit": "flats"},
    {action: "have", "item": "lettuce", "quantity": 1, "unit": "case"},
    {action: "have", "item": "spinach", "quantity": 2, "unit": "cases"},
    {action: "don't have any", "item": "kale", "quantity": 0, "unit": null},
    {action: "have", "item": "whole milk", "quantity": 10, "unit": "gallons"}
  ],
  "intent": "update_inventory"
}
```

Example CRUD Output:

```
[
  {
    "operation": "create", // "create", "update", "delete"
    "entity": "inventoryCounts", // a table in the database that keeps track of inventory counts for individual items
  "data": {
    "itemId": number, // id of the item in the database
    "count": number, // quantity of the item
    "userId": number // user id for tracking purposes
    }
  },
  {
    "operation": "update",
    "entity": "inventoryCounts",
    "data": {
      "itemId": number,
      "count": number,
      "userId": number
    }
  },
  ...etc
]
```

## 4. Command Validation Service

This service validates text commands.

## 5. Command Execution Service

This service uses OpenAI's GPT-4 model to execute text commands.

## 6. Response Generation Service

This service uses OpenAI's GPT-4 model to generate responses to text commands.
