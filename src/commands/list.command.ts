import { TicketPriority, TicketStatus } from '../models/ticket.js';
import { TicketService, TicketFilters } from '../services/ticket.service.js';

export async function ListCommand(args?: {
  status?: string;
  priority?: string;
  tag?: string;
}): Promise<void> {
  const service = new TicketService();

  const filters: TicketFilters = {};

  if (args?.status) {
    const status = args.status.toLowerCase();
    if (!Object.values(TicketStatus).includes(status as TicketStatus)) {
      throw new Error(`Invalid status: ${args.status}`);
    }
    filters.status = status as TicketStatus;
  }

  if (args?.priority) {
    const priority = args.priority.toLowerCase();
    if (!Object.values(TicketPriority).includes(priority as TicketPriority)) {
      throw new Error(`Invalid priority: ${args.priority}`);
    }
    filters.priority = priority as TicketPriority;
  }

  if (args?.tag) {
    filters.tag = args.tag;
  }

  const tickets = await service.findAll(filters);

  if (tickets.length === 0) {
    console.log('No tickets found.');
    return;
  }

  console.log(`${tickets.length} ticket(s) found:\n`);

  tickets.forEach((ticket) => {
    const tagsStr = ticket.tags.length > 0 ? ` [${ticket.tags.join(', ')}]` : '';
    console.log(`[${ticket.id.slice(0, 8)}] ${ticket.title}`);
    console.log(`  Status: ${ticket.status} | Priority: ${ticket.priority}${tagsStr}`);
    console.log('');
  });
}
