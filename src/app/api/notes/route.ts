import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { note, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { serializeDbObject } from "@/lib/serialization";

async function getOrCreateUser(clerkId: string) {
    const userRecord = await db.select().from(user).where(eq(user.clerkId, clerkId));

    if (userRecord.length > 0) {
        return userRecord[0];
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
        throw new Error("User not found in Clerk");
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';

    if (!email) {
        throw new Error("User email not found");
    }

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

export async function GET() {
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
        const notes = await db.select().from(note).where(eq(note.userId, userRecord.id));

        return NextResponse.json(serializeDbObject(notes));
    } catch (error) {
        console.error("Error in GET /api/notes:", error);

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

export async function POST(req: Request) {
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

        const [newNote] = await db.insert(note).values({
            title: title || "New Note",
            content: content || "",
            userId: userRecord.id,
        }).returning();

        return NextResponse.json(serializeDbObject(newNote));
    } catch (error) {
        console.error("Error in POST /api/notes:", error);

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