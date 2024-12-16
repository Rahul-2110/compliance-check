export interface LLMResponse {
    content: string;
  }
  
  export interface LLMConfig {
    apiKey?: string;
    baseUrl?: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
    [key: string]: any;
  }
  
  export interface LLMProvider {
    analyze(prompt: string): Promise<LLMResponse>;
    validateConfig(): void;
  }