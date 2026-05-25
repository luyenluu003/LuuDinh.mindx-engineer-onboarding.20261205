import { TicketPriority, TicketStatus } from '../models/ticket.js';
import { TicketService, UpdateTicketInput } from '../services/ticket.service.js';
import { MAX_DESCRIPTION_LENGTH, isValidUUID, normalizeTags, handleError } from '../utils/validation.js';

export async function UpdateCommand(
  id: string,
  args: { status?: string; priority?: string; description?: string; tags?: string[] }
): Promise<void> {
  const trimmedId = id.trim();
  if (!trimmedId || !isValidUUID(trimmedId)) {
    console.error(`Error: Invalid ticket ID format "${id}". Expected a valid UUID.`);
    return;
  }

  if (args.priority !== undefined && args.priority.trim() === '') {
    console.error('Error: Priority cannot be empty.');
    return;
  }

  if (!args.status && !args.priority && !args.description && !args.tags) {
    console.error('Error: At least one update field (status, priority, description, or tags) is required.');
    return;
  }

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

  if (args.tags !== undefined) {
    input.tags = normalizeTags(args.tags);
  }

  try {
    const service = new TicketService();
    const ticket = await service.update(trimmedId, input);

    console.log('Updated ticket:');
    console.log(`  ID: ${ticket.id}`);
    console.log(`  Title: ${ticket.title}`);
    console.log(`  Status: ${ticket.status}`);
    console.log(`  Priority: ${ticket.priority}`);
    if (ticket.tags.length > 0) {
      console.log(`  Tags: ${ticket.tags.join(', ')}`);
    }
    console.log(`  Updated: ${new Date(ticket.updatedAt).toLocaleString()}`);
  } catch (error) {
    if (error instanceof Error && error.message === 'Ticket not found') {
      console.error(`Error: Ticket with ID "${trimmedId}" not found.`);
    } else {
      handleError(error, 'updating ticket');
    }
  }
}
