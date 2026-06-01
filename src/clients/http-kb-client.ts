/**
 * KB API Error class.
 */
export class KBApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'KBApiError';
  }
}

/**
 * HTTP KB Client - kết nối đến real KB API server.
 */
import type { KBDocument, KBSearchQuery, KBSearchResult, KBListQuery, KBAddDocument } from '../models/kb-document.js';
import type { KBClient } from './kb-client.interface.js';
import { getConfig } from '../config/kb-api.config.js';

export class HTTPKBClient implements KBClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(config?: { baseUrl?: string; apiKey?: string; timeout?: number }) {
    const cfg = getConfig();
    this.baseUrl = config?.baseUrl ?? cfg.baseUrl;
    this.apiKey = config?.apiKey ?? cfg.apiKey;
    this.timeout = config?.timeout ?? cfg.timeout ?? 30000;
  }

  async search(query: KBSearchQuery): Promise<KBSearchResult[]> {
    const response = await this.post<KBSearchResponse>('/search', {
      query: query.query,
      topK: query.topK ?? 5,
      tags: query.tags,
    });

    return response.results.map((item) => ({
      document: {
        id: item.id,
        title: item.title,
        content: item.content ?? '',
        nodePath: item.nodePath,
        tags: item.tags ?? [],
      },
      matchType: item.matchType ?? 'exact',
    }));
  }

  async list(query: KBListQuery): Promise<KBDocument[]> {
    const response = await this.post<KBDocumentListResponse>('/list', {
      nodePath: query.nodePath,
      limit: query.limit ?? 10,
      tags: query.tags,
    });

    return response.documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      content: doc.content ?? '',
      nodePath: doc.nodePath,
      tags: doc.tags ?? [],
    }));
  }

  async retrieve(docId: string): Promise<KBDocument | null> {
    try {
      const response = await this.post<{ document: KBDocument | null }>('/retrieve', {
        docId,
      });

      if (!response.document) {
        return null;
      }

      return {
        id: response.document.id,
        title: response.document.title,
        content: response.document.content ?? '',
        nodePath: response.document.nodePath,
        tags: response.document.tags ?? [],
      };
    } catch (error) {
      if (error instanceof KBApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async add(doc: KBAddDocument): Promise<KBDocument> {
    const response = await this.post<{ document: KBDocument }>('/add', {
      title: doc.title,
      content: doc.content,
      nodePath: doc.nodePath,
      tags: doc.tags,
    });

    return response.document;
  }

  private async post<T>(endpoint: string, body: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        throw new KBApiError(
          `API Error: ${response.status} - ${errorBody}`,
          response.status,
          endpoint
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof KBApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new KBApiError(`Request timeout after ${this.timeout}ms`, 408, endpoint);
        }
        throw new KBApiError(`Network error: ${error.message}`, 0, endpoint);
      }

      throw new KBApiError('Unknown error', 0, endpoint);
    }
  }
}

interface KBSearchResponse {
  results: Array<{
    id: string;
    title: string;
    content?: string;
    nodePath: string;
    tags?: string[];
    matchType?: 'exact' | 'partial' | 'fuzzy';
  }>;
}

interface KBDocumentListResponse {
  documents: Array<{
    id: string;
    title: string;
    content?: string;
    nodePath: string;
    tags?: string[];
  }>;
}
