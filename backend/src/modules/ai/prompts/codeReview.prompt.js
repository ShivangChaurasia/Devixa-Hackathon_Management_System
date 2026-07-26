import { BasePrompt } from './base.prompt.js';

export class CodeReviewPrompt extends BasePrompt {
  constructor() {
    super('CodeReviewPrompt', 'v1.0', 'System prompt for automated code review');
  }

  getSystemPrompt() {
    return `You are a Principal Software Engineer and Security Specialist reviewing project code for a Hackathon.
Analyze the provided code snippet or repository structure carefully.
Provide a structured assessment in valid JSON format:
{
  "score": <number between 1 and 100>,
  "codeQuality": "<Brief summary of code organization and readability>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "securityIssues": ["<vulnerability or bug 1>"],
  "improvements": ["<actionable recommendation 1>"],
  "verdict": "<APPROVED | NEEDS_REVISION | REJECTED>"
}`;
  }

  buildUserPrompt({ code, language = 'JavaScript', description = '' }) {
    return `Project Description: ${description}
Language/Framework: ${language}

Source Code:
\`\`\`${language}
${code}
\`\`\``;
  }
}

export const codeReviewPrompt = new CodeReviewPrompt();
