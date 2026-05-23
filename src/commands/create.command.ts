import { TicketPriority, TicketStatus, CreateTicketInput } from '../models/ticket.js';
import { TicketService } from '../services/ticket.service.js';

export async function CreateCommand(args: {
  title: string;
  description?: string;
  priority?: string;
  tags?: string[];
}): Promise<void> {
  const service = new TicketService();

  const input: CreateTicketInput = {
    title: args.title.trim(),
    description: args.description?.trim() || '',
  };

  if (args.priority) {
    const priority = args.priority.toLowerCase();
    if (!Object.values(TicketPriority).includes(priority as TicketPriority)) {
      throw new Error(`Invalid priority: ${args.priority}`);
    }
    input.priority = priority as TicketPriority;
  }

  if (args.tags) {
    input.tags = args.tags;
  }

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
}
