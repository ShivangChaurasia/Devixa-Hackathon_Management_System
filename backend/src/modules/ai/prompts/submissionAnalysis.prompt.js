import { BasePrompt } from './base.prompt.js';

export class SubmissionAnalysisPrompt extends BasePrompt {
  constructor() {
    super('SubmissionAnalysisPrompt', 'v1.0', 'System prompt for analyzing hackathon project submissions');
  }

  getSystemPrompt() {
    return `You are a Technical Hackathon Judge. Evaluate whether a project submission solves the declared problem statement and meets judging criteria.
Output JSON:
{
  "innovationScore": <1-10>,
  "technicalCompleteness": <1-10>,
  "alignmentWithTheme": <1-10>,
  "overallComments": "<Detailed judgment summary>",
  "flaggedIssues": ["<issue 1 if any>"]
}`;
  }

  buildUserPrompt({ problemStatement, projectSummary, githubUrl, liveDemoUrl }) {
    return `Problem Statement: ${problemStatement}
Project Summary: ${projectSummary}
GitHub URL: ${githubUrl || 'N/A'}
Live Demo URL: ${liveDemoUrl || 'N/A'}`;
  }
}

export const submissionAnalysisPrompt = new SubmissionAnalysisPrompt();
