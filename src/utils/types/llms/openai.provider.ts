import { OpenAI } from 'openai';

import { LLMConfig, LLMResponse } from './llm.types';
import { AppError } from '../compliance';
import { BaseLLMProvider } from './base_llm';

export class OpenAIProvider extends BaseLLMProvider {
  private client: OpenAI;

  constructor(config: LLMConfig) {
    super(config);
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl
    });
  }

  async analyze(prompt: string): Promise<LLMResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.modelName || 'gpt-4',
        messages: [
          {
            role: "system",
            content: "You are a compliance checking system that analyzes website content against policy rules."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: this.config.temperature || 0.1,
        response_format: { type: "json_object" }
      });

      return {
        content: completion.choices[0].message.content || ''
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  validateConfig(): void {
    if (!this.config.apiKey) {
      throw new AppError(500, 'OpenAI API key is required');
    }
  }
}
