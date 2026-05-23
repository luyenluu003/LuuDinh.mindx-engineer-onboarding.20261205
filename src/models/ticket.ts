import { z } from 'zod';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

const statusValues = Object.values(TicketStatus) as [string, ...string[]];
const priorityValues = Object.values(TicketPriority) as [string, ...string[]];

const createTicketSchemaInternal = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters')
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .default(''),
  status: z.enum(statusValues).default(TicketStatus.OPEN),
  priority: z.enum(priorityValues).default(TicketPriority.MEDIUM),
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty').max(50, 'Tag must be at most 50 characters'))
    .max(20, 'Maximum 20 tags allowed')
    .default([]),
});

export const createTicketSchema = createTicketSchemaInternal;

export type CreateTicketInput = z.input<typeof createTicketSchemaInternal>;

export interface Ticket extends z.infer<typeof createTicketSchemaInternal> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const ticketSchema = createTicketSchemaInternal.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TicketData = z.infer<typeof ticketSchema>;
