/**
 * KB Client Factory - tạo client dựa trên environment.
 */
import type { KBClient } from './kb-client.interface.js';
import { MockKBClient } from './mock-kb-client.js';
import { HTTPKBClient } from './http-kb-client.js';

export type KBClientType = 'mock' | 'http';

export function createKBClient(type?: KBClientType): KBClient {
  const clientType = type ?? getDefaultClientType();

  switch (clientType) {
    case 'mock':
      return new MockKBClient();
    case 'http':
      return new HTTPKBClient();
    default:
      console.warn(`Unknown KB client type: ${clientType}. Using mock client.`);
      return new MockKBClient();
  }
}

export function getDefaultClientType(): KBClientType {
  const env = process.env.KB_CLIENT_TYPE?.toLowerCase();

  if (env === 'http' || env === 'real') {
    return 'http';
  }

  return 'mock';
}

export function isUsingRealAPI(): boolean {
  return getDefaultClientType() === 'http';
}
