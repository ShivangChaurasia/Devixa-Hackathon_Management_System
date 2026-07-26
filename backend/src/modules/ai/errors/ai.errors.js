import { AppError } from '../../../common/errors/AppError.js';

export class AIError extends AppError {
  constructor(message = 'AI Gateway Error', statusCode = 500, errors = null) {
    super(message, statusCode, errors);
    this.name = 'AIError';
  }
}

export class ProviderUnavailableError extends AIError {
  constructor(providerName, reason = 'Provider is unreachable or in cooldown') {
    super(`AI Provider [${providerName}] unavailable: ${reason}`, 503);
    this.name = 'ProviderUnavailableError';
    this.providerName = providerName;
  }
}

export class ProviderTimeoutError extends AIError {
  constructor(providerName, timeoutMs) {
    super(`AI Provider [${providerName}] timed out after ${timeoutMs}ms`, 504);
    this.name = 'ProviderTimeoutError';
    this.providerName = providerName;
  }
}

export class ProviderRateLimitError extends AIError {
  constructor(providerName) {
    super(`AI Provider [${providerName}] rate limit exceeded (HTTP 429)`, 429);
    this.name = 'ProviderRateLimitError';
    this.providerName = providerName;
  }
}

export class PromptValidationError extends AIError {
  constructor(message = 'Prompt payload failed validation') {
    super(message, 400);
    this.name = 'PromptValidationError';
  }
}

export class ModelNotSupportedError extends AIError {
  constructor(modelName, providerName) {
    super(`Model '${modelName}' is not supported by provider '${providerName}'`, 400);
    this.name = 'ModelNotSupportedError';
  }
}
