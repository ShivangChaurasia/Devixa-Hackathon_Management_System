import crypto from 'crypto';
import { aiRouter } from '../router/aiRouter.js';
import { providerFactory } from '../factory/providerFactory.js';
import { aiHealthManager } from '../health/aiHealthManager.js';
import { aiCacheManager } from '../cache/aiCacheManager.js';
import { aiConfig } from '../config/ai.config.js';
import { AIError } from '../errors/ai.errors.js';
import { logger } from '../../../common/utils/logger.js';

class AIOrchestrator {
  async execute({ task, prompt, systemPrompt, temperature, maxTokens, bypassCache = false }) {
    const requestId = `req_${crypto.randomBytes(6).toString('hex')}`;
    const promptPayload = { prompt, systemPrompt, temperature, maxTokens };

    // 1. Cache Check
    if (!bypassCache) {
      const cachedResponse = aiCacheManager.get(task, promptPayload);
      if (cachedResponse) {
        logger.info(`[AI Orchestrator] Cache Hit | ID: ${requestId} | Task: ${task}`);
        return cachedResponse;
      }
    }

    // 2. Resolve Provider Sequence
    const preferredProviders = aiRouter.getProviderPrioritySequence(task);
    let lastError = null;

    // 3. Fallback & Retry Loop
    for (const providerName of preferredProviders) {
      const provider = providerFactory.getProvider(providerName);
      let retries = 0;

      while (retries <= aiConfig.maxRetriesPerProvider) {
        const attemptStartTime = Date.now();
        try {
          const result = await provider.generateText({
            prompt,
            systemPrompt,
            temperature,
            maxTokens,
          });

          const latencyMs = Date.now() - attemptStartTime;
          aiHealthManager.recordSuccess(providerName, latencyMs);

          const finalResponse = {
            ...result,
            provider: providerName,
            requestId,
          };

          // Cache Result
          aiCacheManager.set(task, promptPayload, finalResponse);

          logger.info(`[AI Orchestrator] Success | ID: ${requestId} | Task: ${task} | Provider: ${providerName} | Latency: ${latencyMs}ms`);
          return finalResponse;
        } catch (err) {
          retries += 1;
          lastError = err;
          aiHealthManager.recordFailure(providerName, err);

          if (retries <= aiConfig.maxRetriesPerProvider) {
            const delay = aiConfig.retryDelayMs * Math.pow(2, retries - 1);
            await new Promise((res) => setTimeout(res, delay));
          }
        }
      }
    }

    logger.error(`[AI Orchestrator] Execution Failed for task '${task}': ${lastError?.message}`);
    throw new AIError(`AI Gateway execution failed for task '${task}': ${lastError?.message}`, 503);
  }
}

export const aiOrchestrator = new AIOrchestrator();
