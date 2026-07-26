export class BaseProvider {
  constructor(name) {
    if (this.constructor === BaseProvider) {
      throw new Error("Abstract class 'BaseProvider' cannot be instantiated directly");
    }
    this.name = name;
  }

  /**
   * Core method that every provider must implement.
   * @param {Object} params - { prompt, systemPrompt, temperature, maxTokens, model }
   * @returns {Promise<{ text: string, model: string, tokensUsed: { promptTokens: number, completionTokens: number, totalTokens: number } }>}
   */
  async generateText(params) {
    throw new Error(`Method 'generateText()' must be implemented by subclass ${this.name}`);
  }
}
