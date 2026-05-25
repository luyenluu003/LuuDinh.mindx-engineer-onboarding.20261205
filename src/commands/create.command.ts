import {
  TicketPriority,
  TicketStatus,
  CreateTicketInput,
} from "../models/ticket.js";
import { TicketService } from "../services/ticket.service.js";

export async function CreateCommand(args: {
  title: string;
  description?: string;
  priority?: string;
  tags?: string[];
}): Promise<void> {
  const service = new TicketService();

  const MAX_TITLE_LENGTH = 200;
  const MAX_DESCRIPTION_LENGTH = 2000;

  if (args.priority !== undefined && args.priority.trim() === "") {
    throw new Error("Priority cannot be empty");
  }

  if (args.title.trim() === "") {
    throw new Error("Title cannot be empty");
  }

  const trimmedTitle = args.title.trim();
  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    console.error(
      `Error: Title exceeds ${MAX_TITLE_LENGTH} characters (${trimmedTitle.length}).`,
    );
    return;
  }

  const trimmedDescription = args.description?.trim() || "";
  if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
    console.error(
      `Error: Description exceeds ${MAX_DESCRIPTION_LENGTH} characters (${trimmedDescription.length}).`,
    );
    return;
  }

  const input: CreateTicketInput = {
    title: trimmedTitle,
    description: trimmedDescription,
  };

  if (args.priority) {
    const priority = args.priority.toLowerCase();
    if (!Object.values(TicketPriority).includes(priority as TicketPriority)) {
      throw new Error(
        `Invalid priority: ${args.priority}. Valid values: ${Object.values(TicketPriority).join(", ")}`,
      );
    }
    input.priority = priority as TicketPriority;
  }

  const MAX_TAGS = 20;

  if (args.tags && args.tags.length > 0) {
    const normalizedTags = args.tags
      .flatMap((tag) => tag.split(/\s+/))
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    let uniqueTags = [...new Set(normalizedTags)];

    if (uniqueTags.length > MAX_TAGS) {
      console.warn(
        `Warning: Too many tags (${uniqueTags.length}). Keeping first ${MAX_TAGS}.`,
      );
      uniqueTags = uniqueTags.slice(0, MAX_TAGS);
    }

    if (uniqueTags.length > 0) {
      input.tags = uniqueTags;
    }
  }

  try {
    const ticket = await service.create(input);

    console.log("Created ticket:");
    console.log(`  ID: ${ticket.id}`);
    console.log(`  Title: ${ticket.title}`);
    console.log(`  Status: ${ticket.status}`);
    console.log(`  Priority: ${ticket.priority}`);
    if (ticket.tags.length > 0) {
      console.log(`  Tags: ${ticket.tags.join(", ")}`);
    }
    console.log(`  Created: ${new Date(ticket.createdAt).toLocaleString()}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Error: An unexpected error occurred while creating the ticket.");
    }
  }
}
