import axios from 'axios';
import { BaseProvider } from './base.provider.js';
import { aiConfig } from '../config/ai.config.js';
import { ProviderRateLimitError, ProviderUnavailableError } from '../errors/ai.errors.js';

export class OpenRouterProvider extends BaseProvider {
  constructor() {
    super('openrouter');
    this.apiKey = aiConfig.providers.openrouter.apiKey;
    this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  }

  async generateText({ prompt, systemPrompt, temperature, maxTokens, model }) {
    if (!this.apiKey) {
      throw new ProviderUnavailableError('openrouter', 'OpenRouter API Key is missing or not configured');
    }

    const selectedModel = model || aiConfig.providers.openrouter.defaultModel;
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: selectedModel,
          messages,
          temperature: temperature ?? aiConfig.defaults.temperature,
          max_tokens: maxTokens ?? aiConfig.defaults.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://devixa.platform',
            'X-Title': 'Devixa Hackathon Platform',
            'Content-Type': 'application/json',
          },
          timeout: aiConfig.timeoutMs,
        }
      );

      const data = response.data;
      const responseText = data.choices?.[0]?.message?.content || '';
      const usage = data.usage || {};

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
      if (err.response?.status === 429) {
        throw new ProviderRateLimitError('openrouter');
      }
      throw new ProviderUnavailableError('openrouter', err.response?.data?.error?.message || err.message);
    }
  }
}
