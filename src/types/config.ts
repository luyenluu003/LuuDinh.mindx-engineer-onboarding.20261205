export interface AppConfig {
  dataDir: string;
  filename: string;
}

export const DEFAULT_CONFIG: AppConfig = {
  dataDir: './data',
  filename: 'tickets.json',
};
