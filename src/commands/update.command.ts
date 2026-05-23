import { TicketPriority, TicketStatus } from '../models/ticket.js';
import { TicketService, UpdateTicketInput } from '../services/ticket.service.js';

const MAX_DESCRIPTION_LENGTH = 2000;

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export async function UpdateCommand(
  id: string,
  args: { status?: string; priority?: string; description?: string }
): Promise<void> {
  const trimmedId = id.trim();
  if (!trimmedId || !isValidUUID(trimmedId)) {
    console.error(`Error: Invalid ticket ID format "${id}". Expected a valid UUID.`);
    return;
  }

  if (!args.status && !args.priority && !args.description) {
    console.error('Error: At least one update field (status, priority, or description) is required.');
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

  if (args.description !== undefined) {
    const trimmedDesc = args.description.trim();
    if (trimmedDesc.length > MAX_DESCRIPTION_LENGTH) {
      console.error(`Error: Description exceeds ${MAX_DESCRIPTION_LENGTH} characters (${trimmedDesc.length}).`);
      return;
    }
    input.description = trimmedDesc;
  }

  try {
    const ticket = await service.update(trimmedId, input);

    console.log('Updated ticket:');
    console.log(`  ID: ${ticket.id}`);
    console.log(`  Title: ${ticket.title}`);
    console.log(`  Status: ${ticket.status}`);
    console.log(`  Priority: ${ticket.priority}`);
    console.log(`  Updated: ${new Date(ticket.updatedAt).toLocaleString()}`);
  } catch (error) {
    if (error instanceof Error && error.message === 'Ticket not found') {
      console.error(`Error: Ticket with ID "${trimmedId}" not found.`);
    } else {
      throw error;
    }
  }
}
