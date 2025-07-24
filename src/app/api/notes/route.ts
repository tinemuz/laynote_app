import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { note, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const { userId: clerkId } = auth();
    if (!clerkId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userRecord = await db.select().from(user).where(eq(user.clerkId, clerkId));
    if (userRecord.length === 0) {
        return new Response("User not found", { status: 404 });
    }
    const appUserId = userRecord[0].id;

    const notes = await db.select().from(note).where(eq(note.userId, appUserId));

    return NextResponse.json(notes);
}


export async function POST(req: Request) {
    const { userId: clerkId } = auth();
    if (!clerkId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userRecord = await db.select().from(user).where(eq(user.clerkId, clerkId));
    if (userRecord.length === 0) {
        return new Response("User not found", { status: 404 });
    }
    const appUserId = userRecord[0].id;


    const { title, content } = await req.json();

    try {
        const [newNote] = await db.insert(note).values({
            title: title || "New Note",
            content: content || "",
            userId: appUserId,
        }).returning();

        return NextResponse.json(newNote);
    } catch (error) {
        console.error("Error creating note:", error);
        return new Response("Error creating note", { status: 500 });
    }
}