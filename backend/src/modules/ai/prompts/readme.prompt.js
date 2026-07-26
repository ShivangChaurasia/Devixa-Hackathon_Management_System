import { BasePrompt } from './base.prompt.js';

export class ReadmePrompt extends BasePrompt {
  constructor() {
    super('ReadmePrompt', 'v1.0', 'System prompt for generating production-quality Markdown README files');
  }

  getSystemPrompt() {
    return `You are a Technical Writer and Senior Developer. Generate a clean, comprehensive, production-ready Markdown README.md for a hackathon submission.
Include badges, Title, Problem Statement, Key Features, Tech Stack table, Installation Guide, and Architecture Overview.
Output ONLY raw markdown content without wrapping code blocks.`;
  }

  buildUserPrompt({ title, description, features = [], techStack = [], repoUrl = '' }) {
    return `Project Title: ${title}
Description: ${description}
Key Features: ${features.join(', ')}
Tech Stack: ${techStack.join(', ')}
Repository: ${repoUrl}`;
  }
}

export const readmePrompt = new ReadmePrompt();
