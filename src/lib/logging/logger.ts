type LogLevel = 'INFO' | 'WARN' | 'ERROR';

type LogInput = {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
};

export function log({ level, message, context }: LogInput) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  const line = JSON.stringify(payload);

  if (level === 'ERROR') {
    console.error(line);
    return;
  }

  if (level === 'WARN') {
    console.warn(line);
    return;
  }

  console.log(line);
}
