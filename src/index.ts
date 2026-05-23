#!/usr/bin/env node

import { CreateCommand, ListCommand, ShowCommand, UpdateCommand } from './commands/index.js';

type Command = 'create' | 'list' | 'show' | 'update';

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

Options for 'create':
  --title <text>            Ticket title (required)
  --description <text>      Ticket description
  --priority <level>        Priority: low, medium, high, critical
  --tags <tag1,tag2>        Comma-separated tags

Options for 'list':
  --status <status>         Filter by status: open, in_progress, resolved, closed
  --priority <level>        Filter by priority: low, medium, high, critical
  --tag <tag>               Filter by tag

Options for 'show':
  <id>                      Ticket ID

Options for 'update':
  <id>                      Ticket ID
  --status <status>         New status: open, in_progress, resolved, closed
  --priority <level>        New priority: low, medium, high, critical

Examples:
  tickets create --title "Fix login bug" --priority high --tags bug,urgent
  tickets list --status open
  tickets list --tag bug
  tickets show 550e8400-e29b-41d4-a716-446655440000
  tickets update 550e8400-e29b-41d4-a716-446655440000 --status closed
`);
}

function parseArgs(args: string[]): { command: Command | null; options: Record<string, string | string[]> } {
  const options: Record<string, string | string[]> = {};
  let i = 0;

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

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('--')) {
        if (key === 'tags') {
          options[key] = nextArg.split(',').map((t) => t.trim());
        } else {
          options[key] = nextArg;
        }
        i += 2;
      } else {
        options[key] = 'true';
        i++;
      }
    } else if (!options.command && ['create', 'list', 'show', 'update'].includes(arg)) {
      options.command = arg as Command;
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

  return { command: options.command as Command | null, options };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { command, options } = parseArgs(args);

  if (options.help === 'true' || !command) {
    printHelp();
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

main();
