import Anthropic from '@anthropic-ai/sdk';

import { LLMConfig, LLMResponse } from './llm.types';
import { BaseLLMProvider } from './base_llm';
import { ContentBlock, ToolUseBlock } from '@anthropic-ai/sdk/resources';
import { AppError } from '../compliance';

export class AnthropicProvider extends BaseLLMProvider {
  private client: Anthropic;

  constructor(config: LLMConfig) {
    super(config);
    this.client = new Anthropic({
      apiKey: config.apiKey
    });
  }

  async analyze(prompt: string): Promise<LLMResponse> {
    try {
      const message = await this.client.messages.create({
        model: this.config.modelName || 'claude-3-opus-20240229',
        max_tokens: this.config.maxTokens || 1024,
        messages: [{
          role: 'user',
          content: prompt
        }],
        system: "You are a compliance checking system that analyzes website content against policy rules."
      });

      return {
        content: "hello"
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  validateConfig(): void {
    if (!this.config.apiKey) {
      throw new AppError(500, 'Anthropic API key is required');
    }
  }
}