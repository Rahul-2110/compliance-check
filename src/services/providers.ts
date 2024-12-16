import { AppError } from "../utils/types/compliance";
import { LLMConfig, LLMProvider } from "../utils/types/llms/llm.types";
// import { OllamaProvider } from "../utils/types/llms/ollama.provider";
import { OpenAIProvider } from "../utils/types/llms/openai.provider";

export type SupportedLLMProvider = 'openai' | 'anthropic' | 'ollama' | string;

export class LLMFactory {
  private static providers = new Map<string, new (config: LLMConfig) => LLMProvider>([
    ['openai', OpenAIProvider],
    // ['anthropic', AnthropicProvider],
    // ['ollama', OllamaProvider]
  ]);

  static registerProvider(
    name: string,
    providerClass: new (config: LLMConfig) => LLMProvider
  ): void {
    this.providers.set(name.toLowerCase(), providerClass);
  }

  static createProvider(name: string, config: LLMConfig): LLMProvider {
    const Provider = this.providers.get(name.toLowerCase());
    
    if (!Provider) {
      throw new AppError(400, `Unsupported LLM provider: ${name}`);
    }

    return new Provider(config);
  }

  static getSupportedProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}