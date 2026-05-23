import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import type { Ticket } from '../models/ticket.js';

export class JsonStorageService {
  private readonly filePath: string;

  constructor(dataDir: string, filename: string) {
    this.filePath = join(dataDir, filename);
  }

  getFilePath(): string {
    return this.filePath;
  }

  async load(): Promise<Ticket[]> {
    try {
      if (!existsSync(this.filePath)) {
        return [];
      }

      const content = readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(content);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as Ticket[];
    } catch {
      return [];
    }
  }

  async save(tickets: Ticket[]): Promise<void> {
    const dir = dirname(this.filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const content = JSON.stringify(tickets, null, 2);
    writeFileSync(this.filePath, content, 'utf-8');
  }
}
