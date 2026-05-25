export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_TAGS = 20;

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function normalizeTags(tags: string[]): string[] {
  const normalized = tags
    .flatMap((tag) => tag.split(/\s+/))
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  const uniqueTags = [...new Set(normalized)];

  if (uniqueTags.length > MAX_TAGS) {
    uniqueTags.length = MAX_TAGS;
  }

  return uniqueTags;
}

export function handleError(error: unknown, context?: string): void {
  const prefix = context ? `Error in ${context}: ` : 'Error: ';
  if (error instanceof Error) {
    console.error(`${prefix}${error.message}`);
  } else {
    console.error(`${prefix}An unexpected error occurred.`);
  }
}
