import convict from "convict";

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  db: {
    host: {
      doc: "Database host name/IP",
      format: String,
      default: "127.0.0.1:27017",
      env: "DB_HOST",
    },
    name: {
      doc: "Database name",
      format: String,
      default: "compliance-checker",
      env: "DB_NAME",
    },
  },
  port: {
    doc: "Port number",
    format: Number,
    default: 3000,
    env: "PORT",
  },
  llm: {
    provider: {
      doc: "LLM provider",
      format: String,
      default: "openai",
      env: "LLM_PROVIDER",
    },
    api_key: {
      doc: "LLM API key",
      format: String,
      default: "your-openai-api-key", 
      env: "LLM_API_KEY",
    },
    model_name: {
      doc: "LLM model name",
      format: String,
      default: "gpt-4o-mini",
      env: "LLM_MODEL_NAME",
    },
    temperature: {
      doc: "LLM temperature",
      format: Number,
      default: 1,
      env: "LLM_TEMPERATURE",
    },
    max_tokens: {
      doc: "LLM max tokens",
      format: Number,
      default: 2048,
      env: "LLM_MAX_TOKENS",  
    }
  }
});

// Perform validation
config.validate({ allowed: "strict" });

export default config;
