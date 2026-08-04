import rulesData from '@/data/cursor-rules.json';

export interface CursorRule {
  id: string;
  rank: number;
  name: string;
  category: string;
  description: string;
  tags: string[];
  sourceUrl?: string;
  rulesText?: string;
}

interface CursorRulesFile {
  meta: { updated: string; methodology: string };
  entries: CursorRule[];
}

const data = rulesData as CursorRulesFile;

export const cursorRulesMeta = data.meta;
export const cursorRules: CursorRule[] = data.entries;

export function getCursorRule(id: string): CursorRule | undefined {
  return cursorRules.find((r) => r.id === id);
}

export function getCursorRuleCategories(): { category: string; count: number }[] {
  const counts: Record<string, number> = {};
  cursorRules.forEach((r) => {
    counts[r.category] = (counts[r.category] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export const DEFAULT_RULES_TEXT = `# Project rules for Cursor

You are an expert software engineer. Follow these principles:

- Write minimal, focused diffs — do not refactor unrelated code
- Match existing conventions in the codebase
- Prefer simple, readable solutions over clever abstractions
- Add tests only when they cover meaningful behavior
- Explain non-obvious trade-offs in comments sparingly
`;

export function rulesTextFor(rule: CursorRule): string {
  return rule.rulesText ?? DEFAULT_RULES_TEXT.replace('Project rules', `${rule.name} rules`);
}
