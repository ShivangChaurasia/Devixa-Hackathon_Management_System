import { inMemoryCache } from '../../../common/cache/inMemoryCache.js';
import { aiConfig } from '../config/ai.config.js';

class AICacheManager {
  get(task, promptPayload) {
    return inMemoryCache.get(`ai:${task}`, promptPayload);
  }

  set(task, promptPayload, responseData, ttlSeconds = aiConfig.cacheTTLSeconds) {
    inMemoryCache.set(`ai:${task}`, promptPayload, responseData, ttlSeconds);
  }
}

export const aiCacheManager = new AICacheManager();
