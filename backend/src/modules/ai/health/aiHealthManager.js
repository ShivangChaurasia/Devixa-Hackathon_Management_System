import { aiConfig } from '../config/ai.config.js';
import { logger } from '../../../common/utils/logger.js';

class AIHealthManager {
  constructor() {
    this.providerStatus = {
      groq: { failures: 0, cooldownUntil: 0, totalRequests: 0, successfulRequests: 0, avgLatencyMs: 0 },
      gemini: { failures: 0, cooldownUntil: 0, totalRequests: 0, successfulRequests: 0, avgLatencyMs: 0 },
      openrouter: { failures: 0, cooldownUntil: 0, totalRequests: 0, successfulRequests: 0, avgLatencyMs: 0 },
    };
  }

  isAvailable(providerName) {
    const status = this.providerStatus[providerName];
    if (!status) return false;

    if (Date.now() < status.cooldownUntil) {
      return false;
    }

    if (status.cooldownUntil !== 0 && Date.now() >= status.cooldownUntil) {
      status.cooldownUntil = 0;
      status.failures = 0;
      logger.info(`[AI Health] Provider '${providerName}' circuit breaker recovered and active.`);
    }

    return true;
  }

  recordSuccess(providerName, latencyMs) {
    const status = this.providerStatus[providerName];
    if (!status) return;

    status.totalRequests += 1;
    status.successfulRequests += 1;
    status.failures = 0;

    status.avgLatencyMs = Math.round(
      (status.avgLatencyMs * (status.successfulRequests - 1) + latencyMs) / status.successfulRequests
    );
  }

  recordFailure(providerName, error) {
    const status = this.providerStatus[providerName];
    if (!status) return;

    status.totalRequests += 1;
    status.failures += 1;

    const isRateLimit = error.statusCode === 429 || error.message.includes('429');

    if (isRateLimit || status.failures >= aiConfig.maxFailuresBeforeCooldown) {
      status.cooldownUntil = Date.now() + aiConfig.cooldownPeriodMs;
      logger.warn(`[AI Health] Provider '${providerName}' entered ${aiConfig.cooldownPeriodMs / 1000}s cooldown.`);
    }
  }

  getHealthSummary() {
    const summary = {};
    const now = Date.now();

    for (const [provider, status] of Object.entries(this.providerStatus)) {
      summary[provider] = {
        isAvailable: this.isAvailable(provider),
        inCooldown: now < status.cooldownUntil,
        cooldownRemainingSeconds: now < status.cooldownUntil ? Math.ceil((status.cooldownUntil - now) / 1000) : 0,
        totalRequests: status.totalRequests,
        successfulRequests: status.successfulRequests,
        consecutiveFailures: status.failures,
        avgLatencyMs: status.avgLatencyMs,
      };
    }
    return summary;
  }
}

export const aiHealthManager = new AIHealthManager();
