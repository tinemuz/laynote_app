export const config = {
    websocket: {
        url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://laynote-websocket.fly.dev/notes',
    },
    database: {
        url: process.env.DATABASE_URL!,
    },
    clerk: {
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
        secretKey: process.env.CLERK_SECRET_KEY!,
        webhookSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET!,
    },
} as const;

export function validateConfig() {
    const requiredEnvVars = [
        'DATABASE_URL',
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'CLERK_WEBHOOK_SIGNING_SECRET',
    ];

    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
} 