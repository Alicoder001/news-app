import { readFileSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';
import { getEnv } from '@/lib/validation/env';
import { log } from '@/lib/logging/logger';

type AgentRuntimeInput<T> = {
  agentName: 'collector' | 'writer' | 'reviewer';
  payload: T;
  schema: z.ZodTypeAny;
  fallback: () => unknown;
};

function loadPrompt(agentName: string, fileName: string) {
  return readFileSync(resolve(process.cwd(), 'prompts', agentName, fileName), 'utf8');
}

function buildCliPrompt(agentName: string, payload: unknown) {
  const system = loadPrompt(agentName, 'system.v1.txt');
  const task = loadPrompt(agentName, 'task.v1.txt');

  return `${system}\n\n${task}\n\nPayload:\n${JSON.stringify(payload, null, 2)}`;
}

async function tryCliExecution(agentName: string, payload: unknown) {
  const env = getEnv();

  if (env.AGENT_RUNTIME_MODE !== 'cli' || !process.env.AGENT_CLI_COMMAND) {
    return null;
  }

  const prompt = buildCliPrompt(agentName, payload);
  log({
    level: 'INFO',
    message: 'CLI agent runtime not configured for this environment, using fallback',
    context: { agentName, promptPreview: prompt.slice(0, 120) },
  });

  return null;
}

export async function runAgentWithValidation<T>({ agentName, payload, schema, fallback }: AgentRuntimeInput<T>) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const candidate = (await tryCliExecution(agentName, payload)) ?? fallback();
    const parsed = schema.safeParse(candidate);

    if (parsed.success) {
      return parsed.data;
    }

    log({
      level: attempt === 3 ? 'ERROR' : 'WARN',
      message: 'Agent output schema validation failed',
      context: {
        agentName,
        attempt,
        issues: parsed.error.issues.map((issue) => issue.message),
      },
    });
  }

  return schema.parse(fallback());
}
