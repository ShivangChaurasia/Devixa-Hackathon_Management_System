import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './base.provider.js';
import { aiConfig } from '../config/ai.config.js';
import { ProviderRateLimitError, ProviderUnavailableError } from '../errors/ai.errors.js';

export class GeminiProvider extends BaseProvider {
  constructor() {
    super('gemini');
    this.ai = null;
    if (aiConfig.providers.gemini.apiKey) {
      this.ai = new GoogleGenerativeAI(aiConfig.providers.gemini.apiKey);
    }
  }

  async generateText({ prompt, systemPrompt, temperature, maxTokens, model }) {
    if (!this.ai) {
      throw new ProviderUnavailableError('gemini', 'Gemini API Key is missing or not configured');
    }

    const selectedModel = model || aiConfig.providers.gemini.defaultModel;

    try {
      const generativeModel = this.ai.getGenerativeModel({
        model: selectedModel,
        systemInstruction: systemPrompt || undefined,
      });

      const result = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: temperature ?? aiConfig.defaults.temperature,
          maxOutputTokens: maxTokens ?? aiConfig.defaults.maxTokens,
        },
      });

      const responseText = result.response.text();
      const usageMetadata = result.response.usageMetadata || {};

      return {
        text: responseText,
        model: selectedModel,
        tokensUsed: {
          promptTokens: usageMetadata.promptTokenCount || 0,
          completionTokens: usageMetadata.candidatesTokenCount || 0,
          totalTokens: usageMetadata.totalTokenCount || 0,
        },
      };
    } catch (err) {
      if (err.message?.includes('429') || err.status === 429) {
        throw new ProviderRateLimitError('gemini');
      }
      throw new ProviderUnavailableError('gemini', err.message);
    }
  }
}
