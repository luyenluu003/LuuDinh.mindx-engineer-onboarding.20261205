import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

describe('CLI Integration Tests', () => {
  const projectRoot = process.cwd();

  const runCli = (args: string, dataDir: string): { stdout: string; stderr: string; status: number } => {
    try {
      const output = execSync(`npx tsx src/index.ts ${args}`, {
        cwd: projectRoot,
        encoding: 'utf-8',
        env: { ...process.env, TICKET_DATA_DIR: dataDir },
        timeout: 30000,
      });
      return { stdout: output, stderr: '', status: 0 };
    } catch (error: unknown) {
      const execError = error as { stdout?: string; stderr?: string; status?: number };
      return {
        stdout: execError.stdout || '',
        stderr: execError.stderr || '',
        status: execError.status || 1,
      };
    }
  };

  const createTestDataDir = (): string => {
    const dir = join(projectRoot, `test-cli-${randomUUID()}`);
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  const cleanupTestDataDir = (dir: string): void => {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  describe('tickets create', () => {
    it('should create a new ticket with title', () => {
      const testDir = createTestDataDir();
      try {
        const result = runCli('create --title "Test Ticket"', testDir);

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('Created ticket:');
        expect(result.stdout).toContain('Test Ticket');
        expect(result.stdout).toContain('ID:');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should create ticket with all options', () => {
      const testDir = createTestDataDir();
      try {
        const result = runCli('create --title "Full Ticket" --description "Description" --priority high --tags bug,urgent', testDir);

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('Full Ticket');
        expect(result.stdout).toContain('high');
        expect(result.stdout).toContain('bug');
        expect(result.stdout).toContain('urgent');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should require title', () => {
      const testDir = createTestDataDir();
      try {
        const result = runCli('create', testDir);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Error: --title is required');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });
  });

  describe('tickets list', () => {
    it('should list empty tickets', () => {
      const testDir = createTestDataDir();
      try {
        const result = runCli('list', testDir);

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('No tickets found');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should list created tickets', () => {
      const testDir = createTestDataDir();
      try {
        runCli('create --title "Ticket 1"', testDir);
        runCli('create --title "Ticket 2"', testDir);

        const result = runCli('list', testDir);

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('Ticket 1');
        expect(result.stdout).toContain('Ticket 2');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should filter by status', () => {
      const testDir = createTestDataDir();
      try {
        runCli('create --title "Open Ticket"', testDir);
        runCli('create --title "Closed Ticket"', testDir);

        const allTickets = runCli('list', testDir);
        const openTickets = runCli('list --status open', testDir);

        expect(allTickets.stdout).toContain('Open Ticket');
        expect(allTickets.stdout).toContain('Closed Ticket');
        expect(openTickets.stdout).toContain('Open Ticket');
        expect(openTickets.stdout).not.toContain('Closed Ticket');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should filter by priority', () => {
      const testDir = createTestDataDir();
      try {
        runCli('create --title "High Ticket" --priority high', testDir);
        runCli('create --title "Low Ticket" --priority low', testDir);

        const highTickets = runCli('list --priority high', testDir);

        expect(highTickets.stdout).toContain('High Ticket');
        expect(highTickets.stdout).not.toContain('Low Ticket');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });
  });

  describe('tickets show', () => {
    it('should show ticket details', () => {
      const testDir = createTestDataDir();
      try {
        runCli('create --title "Show Test" --description "Details" --priority high', testDir);
        const listResult = runCli('list', testDir);

        const idMatch = listResult.stdout.match(/\[([a-f0-9-]+)\]/);
        const ticketId = idMatch?.[1] || '';

        const result = runCli(`show ${ticketId}`, testDir);

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('Show Test');
        expect(result.stdout).toContain('Details');
        expect(result.stdout).toContain('high');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should show error for non-existent ticket', () => {
      const testDir = createTestDataDir();
      try {
        const result = runCli('show non-existent-id', testDir);

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('not found');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });
  });

  describe('tickets update', () => {
    it('should update ticket status', () => {
      const testDir = createTestDataDir();
      try {
        runCli('create --title "Update Test"', testDir);
        const listResult = runCli('list', testDir);

        const idMatch = listResult.stdout.match(/\[([a-f0-9-]+)\]/);
        const ticketId = idMatch?.[1] || '';

        const result = runCli(`update ${ticketId} --status closed`, testDir);

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('Updated ticket:');
        expect(result.stdout).toContain('closed');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should update ticket priority', () => {
      const testDir = createTestDataDir();
      try {
        runCli('create --title "Priority Test"', testDir);
        const listResult = runCli('list', testDir);

        const idMatch = listResult.stdout.match(/\[([a-f0-9-]+)\]/);
        const ticketId = idMatch?.[1] || '';

        const result = runCli(`update ${ticketId} --priority critical`, testDir);

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('critical');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should show error for non-existent ticket', () => {
      const testDir = createTestDataDir();
      try {
        const result = runCli('update non-existent-id --status closed', testDir);

        expect(result.stdout).toContain('not found');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should require at least one update field', () => {
      const testDir = createTestDataDir();
      try {
        runCli('create --title "No Update Test"', testDir);
        const listResult = runCli('list', testDir);

        const idMatch = listResult.stdout.match(/\[([a-f0-9-]+)\]/);
        const ticketId = idMatch?.[1] || '';

        const result = runCli(`update ${ticketId}`, testDir);

        expect(result.stdout).toContain('At least one update field');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });
  });

  describe('JSON storage', () => {
    it('should persist tickets to JSON file', () => {
      const testDir = createTestDataDir();
      try {
        runCli('create --title "Persistent Ticket"', testDir);

        const dataFile = join(testDir, 'tickets.json');
        expect(existsSync(dataFile)).toBe(true);

        const content = readFileSync(dataFile, 'utf-8');
        const tickets = JSON.parse(content);

        expect(tickets).toHaveLength(1);
        expect(tickets[0]?.title).toBe('Persistent Ticket');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });

    it('should handle corrupted JSON gracefully', () => {
      const testDir = createTestDataDir();
      try {
        const dataFile = join(testDir, 'tickets.json');
        writeFileSync(dataFile, 'not valid json');

        const result = runCli('list', testDir);

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('No tickets found');
      } finally {
        cleanupTestDataDir(testDir);
      }
    });
  });
});
