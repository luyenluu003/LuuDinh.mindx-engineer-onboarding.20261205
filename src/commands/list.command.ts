import { TicketPriority, TicketStatus } from '../models/ticket.js';
import { TicketService, TicketFilters } from '../services/ticket.service.js';
import { handleError } from '../utils/validation.js';

export async function ListCommand(args?: {
  status?: string;
  priority?: string;
  tag?: string;
}): Promise<void> {
  try {
    const service = new TicketService();
    const filters: TicketFilters = {};

    if (args?.status) {
      const status = args.status.trim().toLowerCase();
      if (status === '' || status === 'true') {
        console.error('Error: Status filter cannot be empty.');
        return;
      }
      if (!Object.values(TicketStatus).includes(status as TicketStatus)) {
        console.error(`Error: Invalid status "${args.status}". Valid values: ${Object.values(TicketStatus).join(', ')}`);
        return;
      }
      filters.status = status as TicketStatus;
    }

    if (args?.priority) {
      const priority = args.priority.trim().toLowerCase();
      if (priority === '' || priority === 'true') {
        console.error('Error: Priority filter cannot be empty.');
        return;
      }
      if (!Object.values(TicketPriority).includes(priority as TicketPriority)) {
        console.error(`Error: Invalid priority "${args.priority}". Valid values: ${Object.values(TicketPriority).join(', ')}`);
        return;
      }
      filters.priority = priority as TicketPriority;
    }

    if (args?.tag) {
      const tag = args.tag.trim();
      if (tag === '' || tag === 'true') {
        console.error('Error: Tag filter cannot be empty.');
        return;
      }
      filters.tag = tag;
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
  } catch (error) {
    handleError(error, 'listing tickets');
  }
}
