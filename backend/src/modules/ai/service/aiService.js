import { aiOrchestrator } from '../orchestrator/aiOrchestrator.js';
import { TASK_TYPES } from '../registry/providerRegistry.js';
import { codeReviewPrompt } from '../prompts/codeReview.prompt.js';
import { readmePrompt } from '../prompts/readme.prompt.js';
import { summaryPrompt } from '../prompts/summary.prompt.js';
import { submissionAnalysisPrompt } from '../prompts/submissionAnalysis.prompt.js';
import { aiHealthManager } from '../health/aiHealthManager.js';

export class AIService {
  async reviewCode({ code, language, description }) {
    const systemPrompt = codeReviewPrompt.getSystemPrompt();
    const prompt = codeReviewPrompt.buildUserPrompt({ code, language, description });

    const response = await aiOrchestrator.execute({
      task: TASK_TYPES.CODE_REVIEW,
      prompt,
      systemPrompt,
    });

    let structuredOutput;
    try {
      const jsonStart = response.text.indexOf('{');
      const jsonEnd = response.text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        structuredOutput = JSON.parse(response.text.substring(jsonStart, jsonEnd + 1));
      } else {
        structuredOutput = { rawText: response.text };
      }
    } catch (e) {
      structuredOutput = { rawText: response.text };
    }

    return {
      review: structuredOutput,
      meta: {
        provider: response.provider,
        model: response.model,
        requestId: response.requestId,
      },
    };
  }

  async generateREADME({ title, description, features, techStack, repoUrl }) {
    const systemPrompt = readmePrompt.getSystemPrompt();
    const prompt = readmePrompt.buildUserPrompt({ title, description, features, techStack, repoUrl });

    const response = await aiOrchestrator.execute({
      task: TASK_TYPES.GENERATE_README,
      prompt,
      systemPrompt,
    });

    return {
      readme: response.text,
      meta: {
        provider: response.provider,
        model: response.model,
        requestId: response.requestId,
      },
    };
  }

  async analyzeSubmission({ problemStatement, projectSummary, githubUrl, liveDemoUrl }) {
    const systemPrompt = submissionAnalysisPrompt.getSystemPrompt();
    const prompt = submissionAnalysisPrompt.buildUserPrompt({
      problemStatement,
      projectSummary,
      githubUrl,
      liveDemoUrl,
    });

    const response = await aiOrchestrator.execute({
      task: TASK_TYPES.ANALYZE_SUBMISSION,
      prompt,
      systemPrompt,
    });

    let structuredOutput;
    try {
      const jsonStart = response.text.indexOf('{');
      const jsonEnd = response.text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        structuredOutput = JSON.parse(response.text.substring(jsonStart, jsonEnd + 1));
      } else {
        structuredOutput = { rawText: response.text };
      }
    } catch (e) {
      structuredOutput = { rawText: response.text };
    }

    return {
      analysis: structuredOutput,
      meta: {
        provider: response.provider,
        model: response.model,
        requestId: response.requestId,
      },
    };
  }

  async summarizeText({ text }) {
    const systemPrompt = summaryPrompt.getSystemPrompt();
    const prompt = summaryPrompt.buildUserPrompt({ text });

    const response = await aiOrchestrator.execute({
      task: TASK_TYPES.SUMMARIZE,
      prompt,
      systemPrompt,
    });

    return {
      summary: response.text,
      meta: {
        provider: response.provider,
        model: response.model,
        requestId: response.requestId,
      },
    };
  }

  getProviderHealth() {
    return aiHealthManager.getHealthSummary();
  }
}

export const aiService = new AIService();
