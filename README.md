# Compliance Checker API

A TypeScript-based API that checks website content against compliance policies using AI.

## Features

- Express.js REST API with TypeScript
- Flexible LLM integration with support for (In Progress, Base class provided and custom implementations are in progress , Currently only OpenAI is supported)
  - OpenAI (GPT-4, etc.)
  - Anthropic (Claude)
  - Ollama (local deployment)
  - Custom LLM providers
- Web content scraping with Cheerio
- Input validation using Zod
- Comprehensive error handling
- Detailed logging with Winston
- Docker support
- Environment-based configuration

## Project Structure

```
compliance-checker/
├── src/
│   ├── controllers/
│   |   └── compliance.ts
|   |   └── policy.ts
|   ├── db/
|   |   ├── models/
|   |   |   ├── compliance.ts
|   |   |   └── policy.ts
|   |   ├── repositories/
|   |   |   ├── compliance.ts
|   |   |   └── policy.ts
|   |   └── index.ts
|   ├── middleware/
|   |   ├── error.ts
│   ├── services/
│   │   ├── compliance.ts
│   │   ├── providers.ts
|   ├── utils/
│   │   ├── logger.ts
|   |   ├── rateLimit.ts
|   |   ├── scrapper.ts
|   |   └── types/
|   |       ├── llms/
|   |       |   ├── anthropic.ts
|   |       |   ├── base_llm.ts
|   |       |   ├── openai.ts
|   |       |   └── ollama.ts
|   |       └── compliance.ts
|   |       ├── validator/
|   |       |   ├── payload.ts
|   |       |   └── request.ts
│   ├── routes/
│   |   ├── compliance.ts
|   |   └── policy.ts
│   ├── app.ts
│   ├── config.ts
├── tests/
│   ├── unit/
│   │   └── services/
│   └── integration/
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js (v20 or higher)
- npm 

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/compliance-checker.git
cd compliance-checker
```

2. Install dependencies:
```bash
npm install
```

5. Update the `.env` file with your configuration:
```
NODE_ENV=development
PORT=3000
# LLM Configuration
LLM_PROVIDER=openai  # or 'anthropic', 'ollama', or custom provider
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=  # Optional: Use for custom API endpoints
LLM_MODEL_NAME=gpt-4o-mini  # Model name for the chosen provider
LLM_TEMPERATURE=0.1  # Optional: Control randomness
LLM_MAX_TOKENS=2048  # Optional: Max response length
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LLM_API_KEY=your-openai-api-key
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Using Docker
Update the config in docker-compose.yml
```bash
docker-compose up -d
```

## Custom LLM Provider Integration

You can integrate your own LLM provider by implementing the `LLMProvider` interface:

```typescript
import { BaseLLMProvider } from './services/llm/base-llm.provider';
import { LLMConfig, LLMResponse } from './types/llm.types';

export class CustomLLMProvider extends BaseLLMProvider {
  constructor(config: LLMConfig) {
    super(config);
  }

  async analyze(prompt: string): Promise<LLMResponse> {
    // Implement your LLM integration here
    const result = await yourLLMService.analyze(prompt);
    return { content: result };
  }

  validateConfig(): void {
    // Add your configuration validation
    if (!this.config.apiKey) {
      throw new AppError(500, 'API key is required');
    }
  }
}

// Register your provider
LLMFactory.registerProvider('custom', CustomLLMProvider);
```

## API Documentation

Postman collection available [here](https://www.postman.com/example-collections/6131058-a0b2-4f0a-b4e3-c4d0d2e0e1f2)

### Check Compliance

**Endpoint**: `POST /api/v1/compliance/check`

Note: Some websites dont block scraping, so you may need to add a content field to the request body

**Request Body**:
```json
{
  "website_url": "https://example.com",
  "policy_url": "https://example.com/policy"
}
```
OR
```json
{
  "website_url": "https://example.com",
  "content": "sample html content"
}
```
OR
```json
{
  "website_url": "https://example.com",
  "policy_id": "policy_id"
}
```

**Response**:
```json
{
  "violations": [
    {
      "rule": "Marketing Claims Policy",
      "violation": "Unauthorized claim about FDIC insurance",
      "location": "Homepage header section",
      "severity": "high"
    }
  ],
  "summary": "Found 1 high-severity violation",
}
```

### Save Policy

**Endpoint**: `POST /api/v1/policy`

**Request Body**:
```json
{
  "name": "Stripe",
  "url": "https://example.com/policy"
}
```
OR
```json
{
  "name": "https://example.com",
  "content": "sample html content"
}
```

**Response**:
```json
{
    "name": "Stripe",
    "content": "parsed html content",
    "url": "https://docs.stripe.com/treasury/marketing-treasury",
    "version": "1.0.0",
    "active": true,
    "_id": "676076ff5d792247539a8a9d",
    "created_at": "2024-12-16T18:52:47.683Z",
    "modified_at": "2024-12-16T18:52:47.683Z",
    "__v": 0
}
```

### Get Policy

**Endpoint**: `GET /api/v1/policy/${policy_id}`


**Response**:
```json
{
    "name": "Stripe",
    "content": "parsed html content",
    "url": "https://docs.stripe.com/treasury/marketing-treasury",
    "version": "1.0.0",
    "active": true,
    "_id": "676076ff5d792247539a8a9d",
    "created_at": "2024-12-16T18:52:47.683Z",
    "modified_at": "2024-12-16T18:52:47.683Z",
    "__v": 0
}
```


## Error Handling

The API implements comprehensive error handling:

- `400`: Bad Request - Invalid input data
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side issues
- `503`: Service Unavailable - External service issues



## Future Enhancements

- Add more LLM providers
- Add Basic Auth
- Advanced LLM provider configuration using API's
- Better complaince extraction and parsing

