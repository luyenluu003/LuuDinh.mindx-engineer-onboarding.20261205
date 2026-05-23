import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { TicketStatus, TicketPriority } from '../../../src/models/ticket';
import { TicketService } from '../../../src/services/ticket.service';
import { JsonStorageService } from '../../../src/storage/json-storage.service';

describe('TicketService', () => {
  const testDir = join(process.cwd(), `test-service-${randomUUID()}`);
  const testFilename = 'tickets.json';
  let service: TicketService;
  let storage: JsonStorageService;

  beforeEach(() => {
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
    service = new TicketService(testDir, testFilename);
    storage = new JsonStorageService(testDir, testFilename);
  });

  afterEach(async () => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('create', () => {
    it('should create a new ticket with valid input', async () => {
      const ticket = await service.create({
        title: 'New Ticket',
        description: 'Description',
        priority: TicketPriority.HIGH,
        tags: ['bug'],
      });

      expect(ticket.title).toBe('New Ticket');
      expect(ticket.description).toBe('Description');
      expect(ticket.priority).toBe(TicketPriority.HIGH);
      expect(ticket.tags).toEqual(['bug']);
      expect(ticket.status).toBe(TicketStatus.OPEN);
      expect(ticket.id).toBeDefined();
      expect(ticket.createdAt).toBeDefined();
      expect(ticket.updatedAt).toBeDefined();
    });

    it('should reject ticket with empty title', async () => {
      await expect(
        service.create({
          title: '',
          description: 'Description',
        })
      ).rejects.toThrow();
    });

    it('should set createdAt and updatedAt to current time', async () => {
      const beforeCreate = new Date().toISOString();

      const ticket = await service.create({ title: 'Test' });
      const afterCreate = new Date().toISOString();

      expect(ticket.createdAt >= beforeCreate).toBe(true);
      expect(ticket.createdAt <= afterCreate).toBe(true);
      expect(ticket.createdAt).toBe(ticket.updatedAt);
    });

    it('should persist ticket to storage', async () => {
      await service.create({ title: 'Persisted Ticket' });

      const tickets = await storage.load();
      expect(tickets).toHaveLength(1);
      expect(tickets[0]?.title).toBe('Persisted Ticket');
    });
  });

  describe('findAll', () => {
    it('should return all tickets', async () => {
      await service.create({ title: 'Ticket 1' });
      await service.create({ title: 'Ticket 2' });

      const tickets = await service.findAll();

      expect(tickets).toHaveLength(2);
    });

    it('should return empty array when no tickets exist', async () => {
      const tickets = await service.findAll();

      expect(tickets).toEqual([]);
    });

    it('should filter tickets by status', async () => {
      await service.create({ title: 'Open Ticket' });
      await service.create({ title: 'Closed Ticket' });
      await service.update(
        (await service.findAll())[1]?.id || '',
        { status: TicketStatus.CLOSED }
      );

      const openTickets = await service.findAll({ status: TicketStatus.OPEN });

      expect(openTickets).toHaveLength(1);
      expect(openTickets[0]?.title).toBe('Open Ticket');
    });

    it('should filter tickets by priority', async () => {
      await service.create({ title: 'High Ticket', priority: TicketPriority.HIGH });
      await service.create({ title: 'Low Ticket', priority: TicketPriority.LOW });

      const highTickets = await service.findAll({ priority: TicketPriority.HIGH });

      expect(highTickets).toHaveLength(1);
      expect(highTickets[0]?.title).toBe('High Ticket');
    });

    it('should filter tickets by tag', async () => {
      await service.create({ title: 'Bug Ticket', tags: ['bug'] });
      await service.create({ title: 'Feature Ticket', tags: ['feature'] });

      const bugTickets = await service.findAll({ tag: 'bug' });

      expect(bugTickets).toHaveLength(1);
      expect(bugTickets[0]?.title).toBe('Bug Ticket');
    });
  });

  describe('findById', () => {
    it('should return ticket when found', async () => {
      const created = await service.create({ title: 'Find Me' });

      const ticket = await service.findById(created.id);

      expect(ticket).toBeDefined();
      expect(ticket?.title).toBe('Find Me');
    });

    it('should return undefined when ticket not found', async () => {
      const ticket = await service.findById(randomUUID());

      expect(ticket).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update ticket status', async () => {
      const created = await service.create({ title: 'Update Me' });

      const updated = await service.update(created.id, { status: TicketStatus.CLOSED });

      expect(updated.status).toBe(TicketStatus.CLOSED);
      expect(updated.updatedAt).not.toBe(created.updatedAt);
    });

    it('should update ticket priority', async () => {
      const created = await service.create({ title: 'Update Me' });

      const updated = await service.update(created.id, { priority: TicketPriority.CRITICAL });

      expect(updated.priority).toBe(TicketPriority.CRITICAL);
    });

    it('should update ticket title', async () => {
      const created = await service.create({ title: 'Old Title' });

      const updated = await service.update(created.id, { title: 'New Title' });

      expect(updated.title).toBe('New Title');
    });

    it('should update updatedAt timestamp', async () => {
      const created = await service.create({ title: 'Update Me' });
      const beforeUpdate = new Date().toISOString();

      const updated = await service.update(created.id, { title: 'Updated Title' });

      expect(updated.updatedAt >= beforeUpdate).toBe(true);
    });

    it('should throw error when ticket not found', async () => {
      await expect(
        service.update(randomUUID(), { status: TicketStatus.CLOSED })
      ).rejects.toThrow('Ticket not found');
    });

    it('should persist changes to storage', async () => {
      const created = await service.create({ title: 'Persist Test' });

      await service.update(created.id, { title: 'Updated' });

      const tickets = await storage.load();
      expect(tickets[0]?.title).toBe('Updated');
    });
  });
});
