/**
 * KB Add command - thêm document mới vào KB.
 */
import { MockKBClient } from '../../clients/index.js';
import type { KBAddDocument } from '../../models/kb-document.js';
import { readFileSync } from 'fs';

export async function AddCommand(args: {
  file?: string;
  title?: string;
  content?: string;
  nodePath: string;
  tags?: string[];
}): Promise<void> {
  if (!args.nodePath || !args.nodePath.trim().startsWith('/')) {
    console.error('Error: --path must be specified and start with "/" (e.g., /templates/email).');
    process.exit(1);
  }

  const trimmedNodePath = args.nodePath.trim();
  const title = (args.title ?? '').trim() || undefined;

  if (title !== undefined && title.length > 200) {
    console.error('Error: --title must be 200 characters or less.');
    process.exit(1);
  }

  if (args.tags && args.tags.length > 20) {
    console.error('Error: Maximum 20 tags allowed.');
    process.exit(1);
  }

  let docContent: string;

  if (args.file) {
    try {
      docContent = readFileSync(args.file, 'utf-8');
    } catch {
      console.error(`Error: Cannot read file: ${args.file}`);
      process.exit(1);
    }

    if (docContent.length > 1_000_000) {
      console.error('Error: File content exceeds 1MB limit.');
      process.exit(1);
    }
  } else if (args.content) {
    docContent = args.content;

    if (docContent.length > 1_000_000) {
      console.error('Error: Content exceeds 1MB limit.');
      process.exit(1);
    }
  } else {
    console.error('Error: Either --file or --content is required.');
    process.exit(1);
  }

  const defaultTitle = args.file
    ? args.file.split(/[/\\]/).pop()?.replace(/\.[^.]+$/, '') ?? 'Untitled'
    : 'Untitled';

  const newDoc: KBAddDocument = {
    title: title ?? defaultTitle,
    content: docContent,
    nodePath: trimmedNodePath,
    tags: args.tags,
  };

  const client = new MockKBClient();
  const result = await client.add(newDoc);

  console.log('Document added successfully!');
  console.log(`ID: ${result.id}`);
  console.log(`Title: ${result.title}`);
  console.log(`Path: ${result.nodePath}`);
}
