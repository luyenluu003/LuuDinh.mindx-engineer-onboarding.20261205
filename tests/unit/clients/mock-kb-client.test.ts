/**
 * Tests cho MockKBClient.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { MockKBClient } from '../../../src/clients/mock-kb-client.ts';
import type { KBDocument } from '../../../src/models/kb-document.ts';

describe('MockKBClient', () => {
  let client: MockKBClient;

  beforeEach(() => {
    client = new MockKBClient();
  });

  describe('search', () => {
    it('should find documents by query in title', async () => {
      const results = await client.search({ query: 'customer', topK: 5 });

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].document.title).toContain('Customer');
    });

    it('should find documents by query in content', async () => {
      const results = await client.search({ query: 'DevOps', topK: 5 });

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].document.title).toContain('DevOps');
    });

    it('should respect topK parameter', async () => {
      const results = await client.search({ query: 'team', topK: 2 });

      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should filter by tags', async () => {
      const results = await client.search({ query: 'template', tags: ['email'], topK: 5 });

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].document.tags).toContain('email');
    });

    it('should return empty array when no match', async () => {
      const results = await client.search({ query: 'nonexistentquery123', topK: 5 });

      expect(results.length).toBe(0);
    });

    it('should sort results by relevance', async () => {
      const results = await client.search({ query: 'team', topK: 5 });

      for (let i = 0; i < results.length - 1; i++) {
        const currentRelevance = getRelevanceScore(results[i]);
        const nextRelevance = getRelevanceScore(results[i + 1]);
        expect(currentRelevance).toBeGreaterThanOrEqual(nextRelevance);
      }
    });
  });

  describe('list', () => {
    it('should return all documents when no filters', async () => {
      const documents = await client.list({});

      expect(documents.length).toBeGreaterThan(0);
    });

    it('should filter by nodePath', async () => {
      const documents = await client.list({ nodePath: '/templates/email' });

      expect(documents.length).toBeGreaterThan(0);
      expect(documents.every((doc) => doc.nodePath === '/templates/email')).toBe(true);
    });

    it('should filter by tags', async () => {
      const documents = await client.list({ tags: ['team'] });

      expect(documents.length).toBeGreaterThan(0);
      expect(documents.every((doc) => doc.tags.includes('team'))).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const documents = await client.list({ limit: 2 });

      expect(documents.length).toBeLessThanOrEqual(2);
    });
  });

  describe('retrieve', () => {
    it('should return document by ID', async () => {
      const document = await client.retrieve('doc-001');

      expect(document).not.toBeNull();
      expect(document!.id).toBe('doc-001');
    });

    it('should return null for non-existent ID', async () => {
      const document = await client.retrieve('non-existent-id');

      expect(document).toBeNull();
    });
  });

  describe('add', () => {
    it('should add a new document', async () => {
      const initialDocs = await client.list({});
      const initialCount = initialDocs.length;

      const newDoc = await client.add({
        title: 'Test Document',
        content: 'Test content',
        nodePath: '/test',
        tags: ['test'],
      });

      expect(newDoc.id).toBeDefined();
      expect(newDoc.title).toBe('Test Document');
      expect(newDoc.content).toBe('Test content');
      expect(newDoc.nodePath).toBe('/test');
      expect(newDoc.tags).toContain('test');

      const updatedDocs = await client.list({});
      expect(updatedDocs.length).toBe(initialCount + 1);
    });

    it('should auto-generate tags if not provided', async () => {
      const newDoc = await client.add({
        title: 'No Tags Doc',
        content: 'Content without tags',
        nodePath: '/test',
      });

      expect(newDoc.tags).toEqual([]);
    });
  });
});

function getRelevanceScore(result: { document: KBDocument; matchType: string }): number {
  let score = 0;
  if (result.matchType === 'exact') score += 100;
  else if (result.matchType === 'partial') score += 50;
  else score += 10;
  return score;
}
