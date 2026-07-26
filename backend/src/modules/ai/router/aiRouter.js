import { providerRegistry, TASK_TYPES } from '../registry/providerRegistry.js';
import { aiHealthManager } from '../health/aiHealthManager.js';
import { AIError } from '../errors/ai.errors.js';

class AIRouter {
  getProviderPrioritySequence(task) {
    const registrySequence = providerRegistry[task] || ['groq', 'gemini', 'openrouter'];
    
    // Filter available providers based on HealthManager status
    const available = registrySequence.filter((p) => aiHealthManager.isAvailable(p));

    if (available.length === 0) {
      // If all preferred are on cooldown, fallback to any registered provider whose cooldown expired
      const fallbackList = ['groq', 'gemini', 'openrouter'].filter((p) => aiHealthManager.isAvailable(p));
      if (fallbackList.length === 0) {
        throw new AIError('All AI Providers are currently down or in cooldown. Please try again shortly.', 503);
      }
      return fallbackList;
    }

    return available;
  }
}

export const aiRouter = new AIRouter();
