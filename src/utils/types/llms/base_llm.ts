import { LLMConfig, LLMProvider, LLMResponse } from './llm.types';
import logger from '../../logger';
import { AppError } from '../compliance';

export abstract class BaseLLMProvider implements LLMProvider {
  protected config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    this.validateConfig();
  }

  abstract analyze(prompt: string): Promise<LLMResponse>;

  abstract validateConfig(): void;

  protected handleError(error: any): never {
    logger.error('LLM Provider error:', {
      provider: this.constructor.name,
      error: error.message
    });

    throw new AppError(
      503,
      `LLM analysis failed: ${error.message}`
    );
  }
}
