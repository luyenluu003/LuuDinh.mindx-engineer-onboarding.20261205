/**
 * Mock KB Client - in-memory implementation cho testing.
 */
import type { KBDocument, KBSearchQuery, KBSearchResult, KBListQuery, KBAddDocument } from '../models/kb-document.js';
import type { KBClient } from './kb-client.interface.js';

const MOCK_DOCUMENTS: KBDocument[] = [
  {
    id: 'doc-001',
    title: 'Customer Response Template',
    content: `# Customer Response Template

Dear {{customer_name}},

Thank you for contacting us regarding {{issue}}.

## Status Update
Your ticket #{{ticket_id}} is currently {{status}}.

## Next Steps
{{next_steps}}

Best regards,
Customer Support Team`,
    nodePath: '/templates/email',
    tags: ['template', 'email', 'response'],
  },
  {
    id: 'doc-002',
    title: 'DevOps Team Documentation',
    content: `# DevOps Team

## Team Members
- John Doe (Lead)
- Jane Smith (SRE)
- Bob Wilson (CI/CD)

## On-Call Schedule
Week 1: John Doe
Week 2: Jane Smith
Week 3: Bob Wilson

## Responsibilities
- CI/CD pipeline maintenance
- Infrastructure monitoring
- Incident response`,
    nodePath: '/team/devops',
    tags: ['team', 'devops', 'oncall'],
  },
  {
    id: 'doc-003',
    title: 'Welcome Guide',
    content: `# Welcome to the Team!

Welcome aboard! Here's what you need to know:

## First Day
1. Meet your team lead
2. Set up your workstation
3. Review documentation

## Key Resources
- Intranet: internal.company.com
- Help Desk: help@company.com
- Wiki: wiki.company.com`,
    nodePath: '/docs/onboarding',
    tags: ['welcome', 'onboarding', 'guide'],
  },
];

export class MockKBClient implements KBClient {
  private documents: KBDocument[];

  constructor(docs?: KBDocument[]) {
    this.documents = docs ?? [...MOCK_DOCUMENTS];
  }

  async search(query: KBSearchQuery): Promise<KBSearchResult[]> {
    const topK = query.topK ?? 5;
    const lowerQuery = query.query.toLowerCase();

    const results: KBSearchResult[] = [];

    for (const doc of this.documents) {
      if (query.tags && query.tags.length > 0) {
        const hasMatchingTag = query.tags.some((tag) => doc.tags.includes(tag));
        if (!hasMatchingTag) {
          continue;
        }
      }

      const matchType = this.calculateMatchType(doc, lowerQuery);
      if (matchType) {
        results.push({ document: doc, matchType });
      }
    }

    results.sort((a, b) => {
      const scoreA = this.getRelevanceScore(a, lowerQuery);
      const scoreB = this.getRelevanceScore(b, lowerQuery);
      return scoreB - scoreA;
    });

    return results.slice(0, topK);
  }

  async list(query: KBListQuery): Promise<KBDocument[]> {
    let filtered = [...this.documents];

    if (query.nodePath) {
      filtered = filtered.filter((doc) => doc.nodePath === query.nodePath);
    }

    if (query.tags && query.tags.length > 0) {
      filtered = filtered.filter((doc) =>
        query.tags!.some((tag) => doc.tags.includes(tag))
      );
    }

    const limit = query.limit ?? 10;
    return filtered.slice(0, limit);
  }

  async retrieve(docId: string): Promise<KBDocument | null> {
    return this.documents.find((doc) => doc.id === docId) ?? null;
  }

  async add(doc: KBAddDocument): Promise<KBDocument> {
    const newDoc: KBDocument = {
      id: `doc-${Date.now()}`,
      title: doc.title,
      content: doc.content,
      nodePath: doc.nodePath,
      tags: doc.tags ?? [],
    };

    this.documents.push(newDoc);
    return newDoc;
  }

  private calculateMatchType(doc: KBDocument, query: string): 'exact' | 'partial' | 'fuzzy' | null {
    const titleLower = doc.title.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const tagsString = doc.tags.join(' ').toLowerCase();
    const queryLower = query.toLowerCase();

    if (titleLower.includes(queryLower) || tagsString.includes(queryLower)) {
      return 'exact';
    }

    if (contentLower.includes(queryLower)) {
      return 'partial';
    }

    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 0);
    const contentWords = contentLower.split(/\s+/);
    const titleWords = titleLower.split(/\s+/);

    let matchedWords = 0;
    for (const queryWord of queryWords) {
      if (
        titleWords.some((tw) => tw.startsWith(queryWord)) ||
        contentWords.some((cw) => cw.startsWith(queryWord))
      ) {
        matchedWords++;
      }
    }

    if (matchedWords === queryWords.length && queryWords.length > 0) {
      return 'fuzzy';
    }

    return null;
  }

  private getRelevanceScore(result: KBSearchResult, query: string): number {
    const doc = result.document;
    let score = 0;

    if (result.matchType === 'exact') {
      score += 100;
    } else if (result.matchType === 'partial') {
      score += 50;
    } else {
      score += 10;
    }

    if (doc.title.toLowerCase().includes(query)) {
      score += 20;
    }

    if (doc.tags.some((tag) => tag.toLowerCase().includes(query))) {
      score += 15;
    }

    return score;
  }
}
