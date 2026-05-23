import { describe, it, expect } from 'vitest';
import { TicketStatus, TicketPriority, createTicketSchema } from '../../../src/models/ticket';

describe('Ticket Model', () => {
  describe('TicketStatus Enum', () => {
    it('should have all required status values', () => {
      expect(TicketStatus.OPEN).toBe('open');
      expect(TicketStatus.IN_PROGRESS).toBe('in_progress');
      expect(TicketStatus.RESOLVED).toBe('resolved');
      expect(TicketStatus.CLOSED).toBe('closed');
    });

    it('should have exactly 4 status values', () => {
      const statusValues = Object.values(TicketStatus);
      expect(statusValues).toHaveLength(4);
    });
  });

  describe('TicketPriority Enum', () => {
    it('should have all required priority values', () => {
      expect(TicketPriority.LOW).toBe('low');
      expect(TicketPriority.MEDIUM).toBe('medium');
      expect(TicketPriority.HIGH).toBe('high');
      expect(TicketPriority.CRITICAL).toBe('critical');
    });

    it('should have exactly 4 priority values', () => {
      const priorityValues = Object.values(TicketPriority);
      expect(priorityValues).toHaveLength(4);
    });
  });

  describe('createTicketSchema', () => {
    it('should validate a valid ticket input', () => {
      const validInput = {
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.OPEN,
        priority: TicketPriority.MEDIUM,
        tags: ['bug', 'urgent'],
      };

      const result = createTicketSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Ticket');
        expect(result.data.description).toBe('Test Description');
        expect(result.data.status).toBe(TicketStatus.OPEN);
        expect(result.data.priority).toBe(TicketPriority.MEDIUM);
        expect(result.data.tags).toEqual(['bug', 'urgent']);
      }
    });

    it('should reject ticket without title', () => {
      const invalidInput = {
        description: 'Test Description',
        priority: TicketPriority.MEDIUM,
      };

      const result = createTicketSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should reject ticket with title shorter than 1 character', () => {
      const invalidInput = {
        title: '',
        description: 'Test Description',
        priority: TicketPriority.MEDIUM,
      };

      const result = createTicketSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should reject ticket with invalid status', () => {
      const invalidInput = {
        title: 'Test Ticket',
        description: 'Test Description',
        status: 'invalid_status',
        priority: TicketPriority.MEDIUM,
      };

      const result = createTicketSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should reject ticket with invalid priority', () => {
      const invalidInput = {
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.OPEN,
        priority: 'invalid_priority',
      };

      const result = createTicketSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should default status to OPEN if not provided', () => {
      const inputWithDefaults = {
        title: 'Test Ticket',
        description: 'Test Description',
        priority: TicketPriority.MEDIUM,
      };

      const result = createTicketSchema.safeParse(inputWithDefaults);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(TicketStatus.OPEN);
      }
    });

    it('should default priority to MEDIUM if not provided', () => {
      const inputWithDefaults = {
        title: 'Test Ticket',
        description: 'Test Description',
      };

      const result = createTicketSchema.safeParse(inputWithDefaults);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priority).toBe(TicketPriority.MEDIUM);
      }
    });

    it('should default tags to empty array if not provided', () => {
      const inputWithDefaults = {
        title: 'Test Ticket',
        description: 'Test Description',
      };

      const result = createTicketSchema.safeParse(inputWithDefaults);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toEqual([]);
      }
    });

    it('should reject tags that are not an array of strings', () => {
      const invalidInput = {
        title: 'Test Ticket',
        description: 'Test Description',
        tags: 'not-an-array',
      };

      const result = createTicketSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should reject if any tag is not a string', () => {
      const invalidInput = {
        title: 'Test Ticket',
        description: 'Test Description',
        tags: ['valid', 123, 'another'],
      };

      const result = createTicketSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should trim whitespace from title', () => {
      const inputWithWhitespace = {
        title: '  Test Ticket  ',
        description: 'Test Description',
        priority: TicketPriority.MEDIUM,
      };

      const result = createTicketSchema.safeParse(inputWithWhitespace);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Ticket');
      }
    });
  });
});
