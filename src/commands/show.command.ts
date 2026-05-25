import { TicketService } from '../services/ticket.service.js';
import { isValidUUID, handleError } from '../utils/validation.js';

export async function ShowCommand(id: string): Promise<void> {
  const trimmedId = id.trim();
  if (!trimmedId || !isValidUUID(trimmedId)) {
    console.error(`Error: Invalid ticket ID format "${id}". Expected a valid UUID.`);
    return;
  }

  try {
    const service = new TicketService();
    const ticket = await service.findById(trimmedId);

    if (!ticket) {
      console.error(`Error: Ticket with ID "${trimmedId}" not found.`);
      return;
    }

    console.log('Ticket Details:');
    console.log(`  ID: ${ticket.id}`);
    console.log(`  Title: ${ticket.title}`);
    console.log(`  Description: ${ticket.description || '(none)'}`);
    console.log(`  Status: ${ticket.status}`);
    console.log(`  Priority: ${ticket.priority}`);
    console.log(`  Tags: ${ticket.tags.length > 0 ? ticket.tags.join(', ') : '(none)'}`);
    console.log(`  Created: ${new Date(ticket.createdAt).toLocaleString()}`);
    console.log(`  Updated: ${new Date(ticket.updatedAt).toLocaleString()}`);
  } catch (error) {
    handleError(error, 'fetching ticket');
  }
}
