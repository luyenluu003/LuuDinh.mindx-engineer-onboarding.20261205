/**
 * KB Search command - tìm kiếm documents trong KB.
 */
import { createKBClient } from '../../clients/index.js';
import type { KBSearchQuery } from '../../models/kb-document.js';

export async function SearchCommand(args: {
  query: string;
  topK?: number;
  tags?: string[];
}): Promise<void> {
  const trimmedQuery = args.query.trim();
  if (!trimmedQuery) {
    console.error('Error: Query cannot be empty or whitespace only.');
    process.exit(1);
  }

  let topK = args.topK ?? 5;
  if (topK < 1) {
    topK = 5;
    console.warn('Warning: --top-k must be at least 1. Using default value: 5');
  }

  const client = createKBClient();

  const searchQuery: KBSearchQuery = {
    query: trimmedQuery,
    topK,
    tags: args.tags,
  };

  const results = await client.search(searchQuery);

  if (results.length === 0) {
    console.log('No documents found matching your query.');
    return;
  }

  console.log(`Found ${results.length} document(s):\n`);

  for (const result of results) {
    console.log(`[${result.matchType.toUpperCase()}] ${result.document.title}`);
    console.log(`  ID: ${result.document.id}`);
    console.log(`  Path: ${result.document.nodePath}`);
    console.log(`  Tags: ${result.document.tags.join(', ')}`);
    console.log(`  Preview: ${result.document.content.slice(0, 100).replace(/\n/g, ' ')}...`);
    console.log();
  }
}
