This is a simple inventory app that uses LLMs to interpret and execute commands.

## 1. Audio Transcription Service

This service uses OpenAI's Whisper model to transcribe audio files into text.

Example Input: example.wave (audio file)

Example Output: "So, we have 13 bags of avocados, we have two flats of tomatoes, we have one case of lettuce, two cases of spinach, we don't have any kale, and we have 10 gallons of whole milk."

## 2. Text Preprocessing Service

This service cleans and normalizes the text while retaining action phrases that convey the user's intent.
Cleans and normalizes the transcribed text to ensure it's free from unnecessary noise (e.g., filler words, non-essential phrases).
Retains critical action phrases that convey the user's intent (e.g., "restock," "add item").

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

Takes the preprocessed text and identifies the user's intent.
Uses the Vector Search Service to find the relevant items in the database.
Based on the parsed actions, it determines which CRUD operations (Create, Read, Update, Delete) need to be executed on the inventory database.

This service uses OpenAI's GPT-4 model to map intent/actions to CRUD operations and generate crud commands for the database.

- Mapps intent/actions to CRUD operations
- Uses contextual knowledge of existing inventory data to decide whether to create a new record or update an existing one.
- Generates CRUD commands

Database Schema awareness. Feed the LLM it a description of the tables and fields.
Entity recognition and mapping. Use entity recognition to map the spoken word to a database entity.
Fuzzy matching or search.
Dynamic propmting - here's the inventory (list of items and searching)

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

Build an API around my database so

This service validates text commands.

## 5. Command Execution Service

This service uses OpenAI's GPT-4 model to execute text commands.
Once an item is matched and the action is understood, the correct CRUD operation is generated and executed.
This uses the CRUD Operation Service to generate the CRUD operation.
This ensures the system is updated in real-time based on the user's verbal input.

## 6. User Feedback Generation Service

This service uses OpenAI's GPT-4 model to generate responses to text commands.

## 7. Dynamic Embedding Service

Dynamic Embeddings: Every time a user adds a new item to the inventory, an embedding is generated for that item, which is a vector representation of its meaning (e.g., item name, brand, description).
This embedding is stored in a vector database (like Pinecone, FAISS), where it can be searched by the LLM when matching future user queries.
For changes like inventory counts, embeddings remain the same, but metadata updates (e.g., item descriptions) would trigger new embeddings.

## 8. Vector Search Service

Uses a vector similarity search (like Pinecone) to match user queries (embedded as vectors) against the pre-computed item embeddings in the database.
This enables semantic matching between what the user says ans the relevant inventory items, even if phrasing or naming conventions differ.

## 9. Database CRUD API Service

This is the API wrapper around the database that the LLM uses to execute the CRUD operations.

####Step-by-step sequence of operations for a typical user prompt, illustrating how each service would interact.

User says: "Restock espresso beans to 50 units"

Step 1: Audio Transcription Service

- Input: example.wave (audio file)
- Output: "Set stock of espresso beans to 50 units" (text)

Step 2: Text Preprocessing Service

- Input: "Set stock of espresso beans to 50 units"
- Output:

```
{
  "action": "set stock",
  "quantity": 50,
  "unit": "units",
  "item": "espresso beans"
}
```

Step 3: Embedding Generation for Query

- Input: the processed text from the user, focusing on the item ("espresso beans")
- Operation: The Embedding Service generates a vector representation for "espresso beans" using an embedding model. (ex. OpenAI's embedding API) This vector captures the semantic meaning of the item.
- Output: A vector (ex. [0.23, 0.45, -0.12, ...]), is generated for the user's input "espresso beans"

Step 4: Vector Search in Database

- Input: The query embedding [0.23, 0.45, -0.12, ...] from Step 3.
- Operation: The Vector Database (eg. Pinecone or FAISS) is queried to find the most similar item in the inventory by comparing the query embedding with the pre-stored item embeddings.
- Output: The vector search returns the clsoest match from the inventory database, for example:

```
{
  "itemId": 123,
  "itemName": "espresso beans",
  "brand": "Voyager Coffee",
  "description": "100% Arabica coffee beans"
}
```

Step 5: Action Interpretation

- Input: The matched item ("Espresso Beans - Voyager Coffee") and the user's intent to "set stock to 50 units".
- Operation: The Action Interpretation Service determines the exact action to be performed in this case it would be a "create" operation for a new InventoryCount record.
- Output: The service constructs the appropriate CRUD command and sends it to the Command Execution Service.

Step 6: Command Execution

- Input: The CRUD command from Step 5.
- Operation: The Command Execution Service sends the CRUD command to the database API service, which executes the command.
- Output: The database is updated with the new count for "espresso beans" (50 units).

Step 7: User Feedback

- Input: The result of the CRUD operation (successful update)
- Operation: The system uses the LLM to generate a user-friendly response summarizing the completed action.
- Output: The system responds to the user: "Espresso bean count updated to 50 units."
