/**
 * KB Document entity.
 */
export interface KBDocument {
  id: string;
  title: string;
  content: string;
  nodePath: string;
  tags: string[];
}

/**
 * Search result với match type.
 */
export interface KBSearchResult {
  document: KBDocument;
  matchType: 'exact' | 'partial' | 'fuzzy';
}

/**
 * Search query parameters.
 */
export interface KBSearchQuery {
  query: string;
  topK?: number;
  tags?: string[];
}

/**
 * List query parameters.
 */
export interface KBListQuery {
  nodePath?: string;
  limit?: number;
  tags?: string[];
}

/**
 * Add document parameters.
 */
export interface KBAddDocument {
  title: string;
  content: string;
  nodePath: string;
  tags?: string[];
}
