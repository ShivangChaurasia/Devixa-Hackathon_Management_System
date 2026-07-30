export const TASK_TYPES = {
  CODE_REVIEW: 'CODE_REVIEW',
  GENERATE_README: 'GENERATE_README',
  ANALYZE_SUBMISSION: 'ANALYZE_SUBMISSION',
  SUMMARIZE: 'SUMMARIZE',
  EXPLAIN_CODE: 'EXPLAIN_CODE',
  JUDGE_ASSIST: 'JUDGE_ASSIST',
  CHAT: 'CHAT',
};

// Priority list per task type. Router falls back in array order if a provider is unavailable.
export const providerRegistry = {
  [TASK_TYPES.CODE_REVIEW]: ['groq', 'gemini', 'openrouter'],
  [TASK_TYPES.EXPLAIN_CODE]: ['groq', 'gemini', 'openrouter'],
  [TASK_TYPES.GENERATE_README]: ['groq', 'openrouter', 'gemini'],
  [TASK_TYPES.ANALYZE_SUBMISSION]: ['gemini', 'groq', 'openrouter'],
  [TASK_TYPES.JUDGE_ASSIST]: ['gemini', 'groq', 'openrouter'],
  [TASK_TYPES.SUMMARIZE]: ['openrouter', 'groq', 'gemini'],
  [TASK_TYPES.CHAT]: ['gemini', 'groq', 'openrouter'],
};
