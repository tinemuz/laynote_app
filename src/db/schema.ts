import {bigint, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";

export const user = pgTable("laynote_user", {
    id: bigint({ mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
    clerkId: varchar("clerk_id", { length: 191 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    tier: varchar({ length: 50 }).default("free").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const note = pgTable("laynote_note", {
    id: bigint({ mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    userId: bigint("user_id", { mode: "bigint" }).references(() => user.id),
    content: varchar(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});