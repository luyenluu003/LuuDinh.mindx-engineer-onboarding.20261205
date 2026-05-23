import { TicketService } from '../services/ticket.service.js';

export async function ShowCommand(id: string): Promise<void> {
  const service = new TicketService();

  const ticket = await service.findById(id);

  if (!ticket) {
    console.error(`Error: Ticket with ID "${id}" not found.`);
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
}
