export function mapUpdates( data: Record<string, any>, allowed: readonly string[] ) {
    const updates: Record<string, any> = {};

    for (const field of allowed) {
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    }

    return updates;
}