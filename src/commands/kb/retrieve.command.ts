/**
 * KB Retrieve command - lấy chi tiết một document theo ID.
 */
import { createKBClient } from '../../clients/index.js';

export async function RetrieveCommand(args: { docId: string }): Promise<void> {
  const docId = args.docId.trim();

  if (!docId) {
    console.error('Error: Document ID cannot be empty.');
    process.exit(1);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(docId)) {
    console.error('Error: Invalid document ID format. Use only alphanumeric characters, underscores, and hyphens.');
    process.exit(1);
  }

  const client = createKBClient();
  const document = await client.retrieve(docId);

  if (!document) {
    console.error(`Document not found: ${docId}`);
    process.exit(1);
  }

  console.log(`# ${document.title}\n`);
  console.log(`**ID:** ${document.id}`);
  console.log(`**Path:** ${document.nodePath}`);
  console.log(`**Tags:** ${document.tags.join(', ')}\n`);
  console.log('---');
  console.log(document.content);
}
