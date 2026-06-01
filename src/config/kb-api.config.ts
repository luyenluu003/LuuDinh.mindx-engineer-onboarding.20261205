/**
 * KB API Configuration.
 */
export interface KBApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export const DEFAULT_CONFIG: Partial<KBApiConfig> = {
  baseUrl: process.env.KB_API_URL ?? 'http://localhost:3000/api/kb',
  apiKey: process.env.KB_API_KEY,
  timeout: 30000,
};

export function getConfig(): KBApiConfig {
  return {
    baseUrl: process.env.KB_API_URL ?? DEFAULT_CONFIG.baseUrl!,
    apiKey: process.env.KB_API_KEY ?? DEFAULT_CONFIG.apiKey,
    timeout: parseInt(process.env.KB_TIMEOUT ?? '30000', 10),
  };
}
