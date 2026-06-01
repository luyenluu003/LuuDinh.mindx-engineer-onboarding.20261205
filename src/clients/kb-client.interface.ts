/**
 * KB Client interface - định nghĩa contract cho tất cả KB client implementations.
 */
import type { KBDocument, KBSearchQuery, KBSearchResult, KBListQuery, KBAddDocument } from '../models/kb-document.js';

export interface KBClient {
  /**
   * Search documents by query.
   */
  search(query: KBSearchQuery): Promise<KBSearchResult[]>;

  /**
   * List documents in a node or with filters.
   */
  list(query: KBListQuery): Promise<KBDocument[]>;

  /**
   * Retrieve a single document by ID.
   */
  retrieve(docId: string): Promise<KBDocument | null>;

  /**
   * Add a new document.
   */
  add(doc: KBAddDocument): Promise<KBDocument>;
}
