import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("laynote_user", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    clerkId: varchar("clerk_id", { length: 191 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    tier: varchar("tier", { length: 50 }).default("free").notNull(),
});

export const note = pgTable("laynote_note", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    userId: integer().references(()=>user.id),
    content: varchar(),
});