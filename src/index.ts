#!/usr/bin/env node

import { CreateCommand, ListCommand, ShowCommand, UpdateCommand } from './commands/index.js';
import { SearchCommand, ListCommand as KBListCommand, RetrieveCommand, AddCommand } from './commands/kb/index.js';

type Command = 'create' | 'list' | 'show' | 'update' | 'kb';

function printHelp(): void {
  console.log(`
Ticket Manager CLI

Usage:
  tickets <command> [options]

Commands:
  create                    Create a new ticket
  list                      List all tickets
  show <id>                 Show ticket details
  update <id> [options]     Update a ticket
  kb <subcommand>           Knowledge Base commands

KB Subcommands:
  kb search <query>         Search documents
  kb list [--node <path>]   List documents
  kb retrieve <id>          Get document details
  kb add --path <path>      Add new document

Options for 'create':
  --title <text>            Ticket title (required)
  --description <text>      Ticket description
  --priority <level>        Priority: low, medium, high, critical
  --tags <tag1,tag2>        Comma-separated tags

Options for 'list':
  --status <status>         Filter by status: open, in_progress, resolved, closed
  --priority <level>        Filter by priority: low, medium, high, critical
  --tag <tag>               Filter by tag

Options for 'kb search':
  <query>                    Search query (required)
  --top-k <number>           Max results (default: 5)
  --tags <tag1,tag2>        Filter by tags

Options for 'kb list':
  --node <path>              Filter by node path
  --limit <number>           Max results (default: 10)
  --tags <tag1,tag2>        Filter by tags

Options for 'kb retrieve':
  <id>                       Document ID (required)

Options for 'kb add':
  --file <path>              File to add (alternative to --content)
  --content <text>           Content (alternative to --file)
  --title <text>             Document title
  --path <path>              Node path (required)
  --tags <tag1,tag2>        Comma-separated tags

Examples:
  tickets create --title "Fix login bug" --priority high --tags bug,urgent
  tickets list --status open
  tickets show 550e8400-e29b-41d4-a716-446655440000
  tickets update 550e8400-e29b-41d4-a716-446655440000 --status closed
  tickets kb search "customer response"
  tickets kb list --node /templates/email
  tickets kb retrieve doc-001
  tickets kb add --file template.md --path /templates/sms --tags sms
`);
}

function parseArgs(args: string[]): { command: Command | null; kbSubcommand: string | null; options: Record<string, string | string[]> } {
  const options: Record<string, string | string[]> = {};
  let i = 0;
  let kbSubcommand: string | null = null;

  while (i < args.length) {
    const arg = args[i];
    if (arg === undefined) {
      i++;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      options.help = 'true';
      i++;
      continue;
    }

    if (arg === 'kb' && !options.command) {
      options.command = 'kb';
      i++;
      continue;
    }

    if (options.command === 'kb' && !kbSubcommand && ['search', 'list', 'retrieve', 'add'].includes(arg)) {
      kbSubcommand = arg;
      i++;
      continue;
    }

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('--')) {
        if (key === 'tags') {
          options[key] = nextArg.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
        } else {
          options[key] = nextArg;
        }
        i += 2;
      } else {
        options[key] = 'true';
        i++;
      }
    } else if (!options.command) {
      if (['create', 'list', 'show', 'update'].includes(arg)) {
        options.command = arg as Exclude<Command, 'kb'>;
      }
      i++;
    } else if (!arg.startsWith('-')) {
      if (!options._) {
        options._ = [];
      }
      (options._ as string[]).push(arg);
      i++;
    } else {
      i++;
    }
  }

  return { command: options.command as Command | null, kbSubcommand, options };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { command, kbSubcommand, options } = parseArgs(args);

  if (options.help === 'true' || !command) {
    printHelp();
    return;
  }

  if (command === 'kb') {
    await handleKBCommand(kbSubcommand, options);
    return;
  }

  try {
    switch (command) {
      case 'create': {
        const title = options.title as string | undefined;
        if (!title) {
          console.error('Error: --title is required for create command.');
          printHelp();
          process.exit(1);
        }
        await CreateCommand({
          title,
          description: options.description as string | undefined,
          priority: options.priority as string | undefined,
          tags: options.tags as string[] | undefined,
        });
        break;
      }

      case 'list': {
        await ListCommand({
          status: options.status as string | undefined,
          priority: options.priority as string | undefined,
          tag: options.tag as string | undefined,
        });
        break;
      }

      case 'show': {
        const id = (options._ as string[] | undefined)?.[0];
        if (!id) {
          console.error('Error: <id> is required for show command.');
          printHelp();
          process.exit(1);
        }
        await ShowCommand(id);
        break;
      }

      case 'update': {
        const id = (options._ as string[] | undefined)?.[0];
        if (!id) {
          console.error('Error: <id> is required for update command.');
          printHelp();
          process.exit(1);
        }
        await UpdateCommand(id, {
          status: options.status as string | undefined,
          priority: options.priority as string | undefined,
          description: options.description as string | undefined,
          tags: options.tags as string[] | undefined,
        });
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        printHelp();
        process.exit(1);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred.');
    }
    process.exit(1);
  }
}

async function handleKBCommand(subcommand: string | null, options: Record<string, string | string[]>): Promise<void> {
  if (!subcommand) {
    console.error('Error: KB subcommand is required. Use: kb search, kb list, kb retrieve, or kb add');
    printHelp();
    process.exit(1);
  }

  if (options.tags && Array.isArray(options.tags)) {
    (options.tags as string[]) = (options.tags as string[]).filter((tag) => tag.length > 0);
    if ((options.tags as string[]).length === 0) {
      delete options.tags;
    }
  }

  try {
    switch (subcommand) {
      case 'search': {
        const query = (options._ as string[] | undefined)?.[0];
        if (!query) {
          console.error('Error: <query> is required for kb search command.');
          process.exit(1);
        }
        const topKStr = options['top-k'] as string | undefined;
        const topK = topKStr !== undefined ? parseInt(topKStr, 10) : undefined;
        if (topKStr !== undefined && (isNaN(topK!) || !Number.isInteger(topK!))) {
          console.error('Error: --top-k must be a valid integer.');
          process.exit(1);
        }
        await SearchCommand({
          query,
          topK,
          tags: options.tags as string[] | undefined,
        });
        break;
      }

      case 'list': {
        const limitStr = options.limit as string | undefined;
        const limit = limitStr !== undefined ? parseInt(limitStr, 10) : undefined;
        if (limitStr !== undefined && (isNaN(limit!) || !Number.isInteger(limit!))) {
          console.error('Error: --limit must be a valid integer.');
          process.exit(1);
        }
        await KBListCommand({
          nodePath: options.node as string | undefined,
          limit,
          tags: options.tags as string[] | undefined,
        });
        break;
      }

      case 'retrieve': {
        const docId = (options._ as string[] | undefined)?.[0];
        if (!docId) {
          console.error('Error: <id> is required for kb retrieve command.');
          process.exit(1);
        }
        await RetrieveCommand({ docId });
        break;
      }

      case 'add': {
        if (!options.path) {
          console.error('Error: --path is required for kb add command.');
          process.exit(1);
        }
        await AddCommand({
          file: options.file as string | undefined,
          title: options.title as string | undefined,
          content: options.content as string | undefined,
          nodePath: options.path as string,
          tags: options.tags as string[] | undefined,
        });
        break;
      }

      default:
        console.error(`Unknown KB subcommand: ${subcommand}`);
        process.exit(1);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred.');
    }
    process.exit(1);
  }
}

main();
