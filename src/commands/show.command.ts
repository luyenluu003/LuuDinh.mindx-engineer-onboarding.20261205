import { TicketService } from '../services/ticket.service.js';

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

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
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error: An unexpected error occurred while fetching the ticket.');
    }
  }
}
