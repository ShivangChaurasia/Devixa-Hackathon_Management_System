const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}`;
};

export const logger = {
  info: (msg, meta) => console.log(formatLog('info', msg, meta)),
  warn: (msg, meta) => console.warn(formatLog('warn', msg, meta)),
  error: (msg, meta) => console.error(formatLog('error', msg, meta)),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog('debug', msg, meta));
    }
  },
};
