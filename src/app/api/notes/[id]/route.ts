import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { note, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { serializeDbObject } from "@/lib/serialization";

// Helper function to get or create user
async function getOrCreateUser(clerkId: string) {
    // First, try to find existing user
    const userRecord = await db.select().from(user).where(eq(user.clerkId, clerkId));

    if (userRecord.length > 0) {
        return userRecord[0];
    }

    // If user doesn't exist in our database, get their info from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
        throw new Error("User not found in Clerk");
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';

    if (!email) {
        throw new Error("User email not found");
    }

    // Create user in our database
    try {
        const [newUser] = await db.insert(user).values({
            clerkId: clerkId,
            email: email,
            name: name,
        }).returning();

        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error("Failed to create user in database");
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await auth();
        const clerkId = authResult?.userId;

        if (!clerkId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userRecord = await getOrCreateUser(clerkId);
        const { title, content } = await req.json();
        const noteId = parseInt(params.id);

        if (isNaN(noteId)) {
            return NextResponse.json(
                { error: "Invalid note ID" },
                { status: 400 }
            );
        }

        const [updatedNote] = await db
            .update(note)
            .set({
                ...(title !== undefined && { title }),
                ...(content !== undefined && { content }),
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(note.id, noteId),
                    eq(note.userId, userRecord.id)
                )
            )
            .returning();

        if (!updatedNote) {
            return NextResponse.json(
                { error: "Note not found or access denied" },
                { status: 404 }
            );
        }

        return NextResponse.json(serializeDbObject(updatedNote));
    } catch (error) {
        console.error("Error in PATCH /api/notes/[id]:", error);

        if (error instanceof Error) {
            if (error.message.includes("Unauthorized")) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }
            if (error.message.includes("not found")) {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 