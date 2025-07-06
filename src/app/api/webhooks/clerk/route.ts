import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db';
import { user } from '@/db/schema';

export async function POST(req: Request) {

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET!;

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");


    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        });
    }


    const payload = await req.json();
    const body = JSON.stringify(payload);


    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;


    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        });
    }

    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name } = evt.data;

        const email = email_addresses[0]?.email_address;
        const name = `${first_name || ''} ${last_name || ''}`.trim();

        if (!id || !email) {
            return new Response('Error: Missing clerkId or email', {
                status: 400,
            });
        }

        try {
            await db.insert(user).values({
                clerkId: id,
                email: email,
                name: name,
            });

            console.log(`User ${id} has been created.`);
        } catch (error) {
            console.error('Error inserting user:', error);
            return new Response('Error occured while creating user', {
                status: 500,
            });
        }
    }

    return new Response('', { status: 201 });
}