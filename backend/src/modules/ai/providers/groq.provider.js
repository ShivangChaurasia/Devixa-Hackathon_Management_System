import Groq from 'groq-sdk';
import { BaseProvider } from './base.provider.js';
import { aiConfig } from '../config/ai.config.js';
import { ProviderRateLimitError, ProviderUnavailableError } from '../errors/ai.errors.js';

export class GroqProvider extends BaseProvider {
  constructor() {
    super('groq');
    this.client = null;
    if (aiConfig.providers.groq.apiKey) {
      this.client = new Groq({ apiKey: aiConfig.providers.groq.apiKey });
    }
  }

  async generateText({ prompt, systemPrompt, temperature, maxTokens, model }) {
    if (!this.client) {
      throw new ProviderUnavailableError('groq', 'Groq API Key is missing or not configured');
    }

    const selectedModel = model || aiConfig.providers.groq.defaultModel;
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    try {
      const completion = await this.client.chat.completions.create({
        messages,
        model: selectedModel,
        temperature: temperature ?? aiConfig.defaults.temperature,
        max_tokens: maxTokens ?? aiConfig.defaults.maxTokens,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const usage = completion.usage || {};

      return {
        text: responseText,
        model: selectedModel,
        tokensUsed: {
          promptTokens: usage.prompt_tokens || 0,
          completionTokens: usage.completion_tokens || 0,
          totalTokens: usage.total_tokens || 0,
        },
      };
    } catch (err) {
      if (err.status === 429) {
        throw new ProviderRateLimitError('groq');
      }
      throw new ProviderUnavailableError('groq', err.message);
    }
  }
}
