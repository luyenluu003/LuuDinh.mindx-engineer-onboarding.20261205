import { TicketPriority, CreateTicketInput } from '../models/ticket.js';
import { TicketService } from '../services/ticket.service.js';
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, normalizeTags, handleError } from '../utils/validation.js';

export async function CreateCommand(args: {
  title: string;
  description?: string;
  priority?: string;
  tags?: string[];
}): Promise<void> {
  if (args.priority !== undefined && args.priority.trim() === '') {
    console.error('Error: Priority cannot be empty.');
    return;
  }

  if (args.title.trim() === '') {
    console.error('Error: Title cannot be empty.');
    return;
  }

  const trimmedTitle = args.title.trim();
  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    console.error(`Error: Title exceeds ${MAX_TITLE_LENGTH} characters (${trimmedTitle.length}).`);
    return;
  }

  const trimmedDescription = args.description?.trim() || '';
  if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
    console.error(`Error: Description exceeds ${MAX_DESCRIPTION_LENGTH} characters (${trimmedDescription.length}).`);
    return;
  }

  const input: CreateTicketInput = {
    title: trimmedTitle,
    description: trimmedDescription,
  };

  if (args.priority) {
    const priority = args.priority.toLowerCase();
    if (!Object.values(TicketPriority).includes(priority as TicketPriority)) {
      console.error(`Error: Invalid priority "${args.priority}". Valid values: ${Object.values(TicketPriority).join(', ')}`);
      return;
    }
    input.priority = priority as TicketPriority;
  }

  if (args.tags && args.tags.length > 0) {
    const uniqueTags = normalizeTags(args.tags);
    if (uniqueTags.length > 0) {
      input.tags = uniqueTags;
    }
  }

  try {
    const service = new TicketService();
    const ticket = await service.create(input);

    console.log('Created ticket:');
    console.log(`  ID: ${ticket.id}`);
    console.log(`  Title: ${ticket.title}`);
    console.log(`  Status: ${ticket.status}`);
    console.log(`  Priority: ${ticket.priority}`);
    if (ticket.tags.length > 0) {
      console.log(`  Tags: ${ticket.tags.join(', ')}`);
    }
    console.log(`  Created: ${new Date(ticket.createdAt).toLocaleString()}`);
  } catch (error) {
    handleError(error, 'creating ticket');
  }
}
