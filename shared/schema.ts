import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  dueDate: text("due_date").notNull(),
  duration: integer("duration").notNull(),
  tag: text("tag").notNull(),
  status: text("status").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks, {
  title: z.string().regex(/^\S(?:.*\S)?$/, "Title cannot have leading/trailing spaces or be empty"),
  dueDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Date must be in YYYY-MM-DD format"),
  duration: z.number().int().min(0, "Duration must be a non-negative integer"),
  tag: z.string().regex(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, "Tag can only contain letters, spaces, and hyphens"),
  status: z.enum(["urgent", "dueSoon", "onTrack", "completed"]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
