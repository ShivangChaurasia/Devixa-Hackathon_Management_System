import { BasePrompt } from './base.prompt.js';

export class SummaryPrompt extends BasePrompt {
  constructor() {
    super('SummaryPrompt', 'v1.0', 'System prompt for concise text summarization');
  }

  getSystemPrompt() {
    return `You are an AI assistant. Provide a concise, clear 3-bullet summary of the provided text.`;
  }

  buildUserPrompt({ text }) {
    return `Text to summarize:\n${text}`;
  }
}

export const summaryPrompt = new SummaryPrompt();
