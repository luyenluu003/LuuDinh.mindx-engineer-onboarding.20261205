import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Ticket } from '../../../src/models/ticket';
import { JsonStorageService } from '../../../src/storage/json-storage.service';

describe('JsonStorageService', () => {
  const testDir = join(process.cwd(), `test-storage-${randomUUID()}`);
  const testFilename = 'test-tickets.json';
  let storageService: JsonStorageService;

  beforeEach(() => {
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
    storageService = new JsonStorageService(testDir, testFilename);
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  const createTestTicket = (overrides = {}): Ticket => ({
    id: randomUUID(),
    title: 'Test Ticket',
    description: 'Test Description',
    status: 'open' as const,
    priority: 'medium' as const,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  describe('getFilePath', () => {
    it('should return correct file path', () => {
      const filePath = storageService.getFilePath();
      expect(filePath).toBe(join(testDir, testFilename));
    });
  });

  describe('load', () => {
    it('should return empty array when file does not exist', async () => {
      const tickets = await storageService.load();
      expect(tickets).toEqual([]);
    });

    it('should load tickets from existing JSON file', async () => {
      const testTickets = [createTestTicket(), createTestTicket()];
      const filePath = join(testDir, testFilename);
      writeFileSync(filePath, JSON.stringify(testTickets, null, 2));

      const tickets = await storageService.load();

      expect(tickets).toHaveLength(2);
      expect(tickets[0]?.id).toBe(testTickets[0]?.id);
    });

    it('should return empty array for empty JSON file', async () => {
      const filePath = join(testDir, testFilename);
      writeFileSync(filePath, '[]');

      const tickets = await storageService.load();

      expect(tickets).toEqual([]);
    });

    it('should handle corrupted JSON file gracefully', async () => {
      const filePath = join(testDir, testFilename);
      writeFileSync(filePath, 'not valid json {{{');

      const tickets = await storageService.load();

      expect(tickets).toEqual([]);
    });
  });

  describe('save', () => {
    it('should create file if it does not exist', async () => {
      const tickets = [createTestTicket()];
      await storageService.save(tickets);

      const filePath = join(testDir, testFilename);
      expect(existsSync(filePath)).toBe(true);

      const content = readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toHaveLength(1);
    });

    it('should overwrite existing file with new data', async () => {
      const filePath = join(testDir, testFilename);
      writeFileSync(filePath, JSON.stringify([createTestTicket()]));

      const newTickets = [createTestTicket(), createTestTicket()];
      await storageService.save(newTickets);

      const content = readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toHaveLength(2);
    });

    it('should save empty array', async () => {
      await storageService.save([]);

      const filePath = join(testDir, testFilename);
      const content = readFileSync(filePath, 'utf-8');
      expect(content).toBe('[]');
    });

    it('should preserve special characters in data', async () => {
      const ticket = createTestTicket({
        title: 'Special <>&"\'',
        tags: ['tag1', 'tag2'],
      });
      await storageService.save([ticket]);

      const filePath = join(testDir, testFilename);
      const content = readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);

      expect(parsed[0]?.title).toBe('Special <>&"\'');
      expect(parsed[0]?.tags).toEqual(['tag1', 'tag2']);
    });
  });
});
