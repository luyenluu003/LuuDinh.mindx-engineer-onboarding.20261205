import { TicketPriority, TicketStatus } from '../models/ticket.js';
import { TicketService, UpdateTicketInput } from '../services/ticket.service.js';

export async function UpdateCommand(
  id: string,
  args: { status?: string; priority?: string }
): Promise<void> {
  if (!args.status && !args.priority) {
    console.error('Error: At least one update field (status or priority) is required.');
    return;
  }

  const service = new TicketService();

  const input: UpdateTicketInput = {};

  if (args.status) {
    const status = args.status.toLowerCase();
    if (!Object.values(TicketStatus).includes(status as TicketStatus)) {
      console.error(`Error: Invalid status "${args.status}". Valid values: ${Object.values(TicketStatus).join(', ')}`);
      return;
    }
    input.status = status as TicketStatus;
  }

  if (args.priority) {
    const priority = args.priority.toLowerCase();
    if (!Object.values(TicketPriority).includes(priority as TicketPriority)) {
      console.error(`Error: Invalid priority "${args.priority}". Valid values: ${Object.values(TicketPriority).join(', ')}`);
      return;
    }
    input.priority = priority as TicketPriority;
  }

  try {
    const ticket = await service.update(id, input);

    console.log('Updated ticket:');
    console.log(`  ID: ${ticket.id}`);
    console.log(`  Title: ${ticket.title}`);
    console.log(`  Status: ${ticket.status}`);
    console.log(`  Priority: ${ticket.priority}`);
    console.log(`  Updated: ${new Date(ticket.updatedAt).toLocaleString()}`);
  } catch (error) {
    if (error instanceof Error && error.message === 'Ticket not found') {
      console.error(`Error: Ticket with ID "${id}" not found.`);
    } else {
      throw error;
    }
  }
}
