import axios from 'axios';

import { AppError } from '../compliance';
import { BaseLLMProvider } from './base_llm';
import { LLMConfig, LLMResponse } from './llm.types';

export class OllamaProvider extends BaseLLMProvider {
  constructor(config: LLMConfig) {
    super({
      baseUrl: 'http://localhost:11434',
      ...config
    });
  }

  async analyze(prompt: string): Promise<LLMResponse> {
    try {
      const response = await axios.post(`${this.config.baseUrl}/api/generate`, {
        model: this.config.modelName || 'llama2',
        prompt: `You are a compliance checking system. ${prompt}`,
        stream: false,
        options: {
          temperature: this.config.temperature || 0.1
        }
      });

      return {
        content: response.data.response
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  validateConfig(): void {
    if (!this.config.baseUrl) {
      throw new AppError(500, 'Ollama API URL is required');
    }
  }
}