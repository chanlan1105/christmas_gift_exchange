import { NextRequest } from "next/server";
import { getUserFromToken } from "../../auth/authToken";
import { sql } from "@/lib/db";

/**
 * Adds a user's claim on an item.
 */
export async function POST(req: NextRequest) {
    const token = req.cookies.get("auth_jwt")?.value;
    if (!token)
        return new Response(null, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user)
        return new Response(null, { status: 403 });

    const { itemId, comment }: { itemId: string, comment?: string } = await req.json();
    if (!itemId)
        return new Response(null, { status: 400 });

    try {
        // Only allow users to claim an item which they have not yet claimed
        const items = await sql`
            SELECT * FROM claimed_items
            WHERE claimed_by = ${user} AND item_id = ${itemId}
        `;

        if (items.length > 0)
            return new Response(null, { status: 400 });

        await sql`
            INSERT INTO claimed_items (item_id, claimed_by, comment)
            VALUES (${itemId}, ${user}, ${comment ?? null})
        `;

        return new Response(null, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }
}

/**
 * Updates the comment on a user's claim on an item.
 */
export async function PUT(req: NextRequest) {
    const token = req.cookies.get("auth_jwt")?.value;
    if (!token)
        return new Response(null, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user)
        return new Response(null, { status: 403 });

    const { itemId, comment }: { itemId: string, comment?: string } = await req.json();
    if (!itemId)
        return new Response(null, { status: 400 });

    try {
        await sql`
            UPDATE claimed_items
            SET comment = ${comment ?? null}
            WHERE claimed_by = ${user} AND item_id = ${itemId}
        `;

        return new Response(null, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }
}

/**
 * Removes a user's claim on an item.
 */
export async function DELETE(req: NextRequest) {
    const token = req.cookies.get("auth_jwt")?.value;
    if (!token)
        return new Response(null, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user)
        return new Response(null, { status: 403 });

    const { itemId }: { itemId: string } = await req.json();
    if (!itemId)
        return new Response(null, { status: 400 });

    try {
        await sql`
            DELETE FROM claimed_items
            WHERE claimed_by = ${user} AND item_id = ${itemId}
        `;

        return new Response(null, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }
}