import { GroqProvider } from '../providers/groq.provider.js';
import { GeminiProvider } from '../providers/gemini.provider.js';
import { OpenRouterProvider } from '../providers/openrouter.provider.js';
import { ModelNotSupportedError } from '../errors/ai.errors.js';

class ProviderFactory {
  constructor() {
    this.providers = new Map();
    // Pre-instantiate singletons
    this.providers.set('groq', new GroqProvider());
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('openrouter', new OpenRouterProvider());
  }

  getProvider(providerName) {
    const provider = this.providers.get(providerName.toLowerCase());
    if (!provider) {
      throw new ModelNotSupportedError('Unknown', providerName);
    }
    return provider;
  }
}

export const providerFactory = new ProviderFactory();
