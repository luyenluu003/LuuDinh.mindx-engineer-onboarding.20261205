/**
 * KB List command - liệt kê documents theo node hoặc filters.
 */
import { MockKBClient } from '../../clients/index.js';
import type { KBListQuery } from '../../models/kb-document.js';

export async function ListCommand(args: {
  nodePath?: string;
  limit?: number;
  tags?: string[];
}): Promise<void> {
  let limit = args.limit ?? 10;
  if (limit < 1) {
    limit = 10;
    console.warn('Warning: --limit must be at least 1. Using default value: 10');
  }

  if (args.nodePath !== undefined) {
    const trimmedNodePath = args.nodePath.trim();
    if (!trimmedNodePath.startsWith('/')) {
      console.error('Error: --node must start with "/" (e.g., /templates/email).');
      process.exit(1);
    }
  }

  const client = new MockKBClient();

  const listQuery: KBListQuery = {
    nodePath: args.nodePath?.trim(),
    limit,
    tags: args.tags,
  };

  const documents = await client.list(listQuery);

  if (documents.length === 0) {
    console.log('No documents found.');
    return;
  }

  console.log(`Found ${documents.length} document(s):\n`);

  for (const doc of documents) {
    console.log(`- ${doc.title}`);
    console.log(`  ID: ${doc.id}`);
    console.log(`  Path: ${doc.nodePath}`);
    console.log(`  Tags: ${doc.tags.join(', ')}`);
    console.log();
  }
}
