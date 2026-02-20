import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'apps', 'web', 'src');
const forbiddenPatterns = [
  /from\s+['"]@\/lib\/prisma['"]/,
  /from\s+['"]@prisma\/client['"]/,
  /import\s+prisma\s+from\s+['"][^'"]*['"]/,
];

const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!fullPath.endsWith('.ts') && !fullPath.endsWith('.tsx')) {
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (forbiddenPatterns.some((pattern) => pattern.test(line))) {
        violations.push(`${fullPath}:${idx + 1} ${line.trim()}`);
      }
    });
  }
}

walk(root);

if (violations.length > 0) {
  console.error('Forbidden Prisma usage found in apps/web/src:');
  for (const line of violations) {
    console.error(line);
  }
  process.exit(1);
}

console.log('OK: no Prisma imports detected in apps/web/src');
