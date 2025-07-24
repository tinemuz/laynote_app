// Helper function to serialize database objects (convert BigInt to string)
export function serializeDbObject(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'bigint') {
        return obj.toString();
    }

    if (Array.isArray(obj)) {
        return obj.map(serializeDbObject);
    }

    if (typeof obj === 'object') {
        const serialized: any = {};
        for (const [key, value] of Object.entries(obj)) {
            serialized[key] = serializeDbObject(value);
        }
        return serialized;
    }

    return obj;
} 