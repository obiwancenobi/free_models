# Data Model: AI Models Application

## Entities

### AI Model
Represents an AI model available through OpenRouter API

**Fields:**
- `id` (string): Unique identifier for the model
- `name` (string): Display name of the model
- `description` (string): Detailed description of the model
- `provider` (string): Company or organization providing the model (e.g., "OpenAI", "Anthropic")
- `pricing` (object): Pricing information
  - `prompt` (number): Cost per prompt token
  - `completion` (number): Cost per completion token
- `context_length` (number): Maximum context length in tokens
- `supported_features` (array): List of supported features (e.g., ["chat", "completion"])
- `created` (number): Date of model created

**Validation Rules:**
- Only include models where `pricing.prompt === 0 && pricing.completion === 0` (free models)
- `id` must be unique and non-empty
- `name` must be non-empty
- `description` should be informative (minimum 10 characters)

**Relationships:**
- None (single entity application)

## State Management

### Application State
- `models` (array): List of all fetched AI models
- `filteredModels` (array): Current filtered list based on search
- `searchTerm` (string): Current search input
- `selectedModel` (object|null): Currently selected model for details view
- `loading` (boolean): Loading state for API calls
- `error` (string|null): Error message if API fails

### Component State
- `bottomSheetOpen` (boolean): Controls bottom sheet visibility
- `searchInput` (string): Local search input state

## Data Flow

1. **Initial Load**: Fetch models from OpenRouter API → Store in `models` → Set `filteredModels` to same
2. **Search**: Update `searchTerm` → Filter `models` → Update `filteredModels`
3. **Model Selection**: Click model → Set `selectedModel` → Open bottom sheet
4. **Error Handling**: API failure → Set `error` → Display error UI

## API Response Structure

Expected from OpenRouter `/models` endpoint:
```json
{
  "data": [
    {
      "id": "gpt-3.5-turbo",
      "name": "GPT-3.5 Turbo",
      "description": "Fast and efficient model by OpenAI",
      "pricing": {
        "prompt": 0,
        "completion": 0
      },
      "context_length": 4096,
      "supported_features": ["chat", "completion"]
    }
  ]
}
```

## Filtering Logic

- Search matches against `name`, `description`, and `provider`
- Case-insensitive matching
- Fuzzy search to handle typos
- Real-time filtering as user types