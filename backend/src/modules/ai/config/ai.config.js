import { config } from '../../../config/env.config.js';

export const aiConfig = {
  timeoutMs: 30000, // 30s timeout per attempt
  maxRetriesPerProvider: 2,
  retryDelayMs: 1000, // 1s initial delay for exponential backoff
  cooldownPeriodMs: 60000, // 60s circuit breaker cooldown on repeated failure/429
  maxFailuresBeforeCooldown: 3,
  cacheTTLSeconds: 86400, // 24 hours Redis TTL for AI outputs

  defaults: {
    temperature: 0.2, // Low temperature for deterministic evaluation/code review
    maxTokens: 2048,
  },

  providers: {
    groq: {
      name: 'groq',
      apiKey: config.ai.groqKey,
      defaultModel: 'llama-3.3-70b-versatile',
      codeModel: 'llama-3.3-70b-versatile',
    },
    gemini: {
      name: 'gemini',
      apiKey: config.ai.geminiKey,
      defaultModel: 'gemini-1.5-pro',
      visionModel: 'gemini-1.5-pro',
    },
    openrouter: {
      name: 'openrouter',
      apiKey: config.ai.openRouterKey,
      defaultModel: 'meta-llama/llama-3.3-70b-instruct',
    },
  },
};
