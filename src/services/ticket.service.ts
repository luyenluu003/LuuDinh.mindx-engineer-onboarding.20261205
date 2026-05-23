import { randomUUID } from 'crypto';
import { createTicketSchema, Ticket, TicketStatus, TicketPriority, CreateTicketInput } from '../models/ticket.js';
import { JsonStorageService } from '../storage/json-storage.service.js';
import { DEFAULT_CONFIG } from '../types/config.js';

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  tag?: string;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  tags?: string[];
}

export class TicketService {
  private readonly storage: JsonStorageService;

  constructor(
    dataDir = process.env.TICKET_DATA_DIR || DEFAULT_CONFIG.dataDir,
    filename = DEFAULT_CONFIG.filename
  ) {
    this.storage = new JsonStorageService(dataDir, filename);
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required');
    }

    if (input.title.trim().length > 200) {
      throw new Error('Title must be at most 200 characters');
    }

    if (input.description && input.description.length > 2000) {
      throw new Error('Description must be at most 2000 characters');
    }

    let normalizedTags = input.tags || [];
    normalizedTags = normalizedTags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (normalizedTags.length > 20) {
      throw new Error('Maximum 20 tags allowed');
    }

    const uniqueTags = [...new Set(normalizedTags)];

    const validated = createTicketSchema.parse({
      title: input.title.trim(),
      description: input.description?.trim() || '',
      priority: input.priority,
      status: input.status,
      tags: uniqueTags,
    });

    const now = new Date().toISOString();
    const ticket: Ticket = {
      ...validated,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    const tickets = await this.storage.load();
    tickets.push(ticket);
    await this.storage.save(tickets);

    return ticket;
  }

  async findAll(filters?: TicketFilters): Promise<Ticket[]> {
    const tickets = await this.storage.load();

    if (!filters) {
      return tickets;
    }

    return tickets.filter((ticket) => {
      if (filters.status && ticket.status !== filters.status) {
        return false;
      }

      if (filters.priority && ticket.priority !== filters.priority) {
        return false;
      }

      if (filters.tag && !ticket.tags.includes(filters.tag)) {
        return false;
      }

      return true;
    });
  }

  async findById(id: string): Promise<Ticket | undefined> {
    const tickets = await this.storage.load();
    return tickets.find((ticket) => ticket.id === id);
  }

  async update(id: string, input: UpdateTicketInput): Promise<Ticket> {
    const tickets = await this.storage.load();
    const index = tickets.findIndex((ticket) => ticket.id === id);

    if (index === -1) {
      throw new Error('Ticket not found');
    }

    const existingTicket = tickets[index];
    if (!existingTicket) {
      throw new Error('Ticket not found');
    }

    if (input.title !== undefined && input.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    if (input.title && input.title.trim().length > 200) {
      throw new Error('Title must be at most 200 characters');
    }

    if (input.description && input.description.length > 2000) {
      throw new Error('Description must be at most 2000 characters');
    }

    let normalizedTags = input.tags || [];
    normalizedTags = normalizedTags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (normalizedTags.length > 20) {
      throw new Error('Maximum 20 tags allowed');
    }

    const uniqueTags = [...new Set(normalizedTags)];

    const validated = createTicketSchema.parse({
      title: input.title?.trim() ?? existingTicket.title,
      description: input.description?.trim() ?? existingTicket.description,
      status: input.status ?? existingTicket.status,
      priority: input.priority ?? existingTicket.priority,
      tags: uniqueTags.length > 0 ? uniqueTags : existingTicket.tags,
    });

    const finalTicket: Ticket = {
      ...existingTicket,
      ...validated,
      updatedAt: new Date().toISOString(),
    };

    tickets[index] = finalTicket;
    await this.storage.save(tickets);

    return finalTicket;
  }
}
