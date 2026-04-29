import { Cousin } from "@/lib/cousins";
import { sql } from "@/lib/db";
import { NextRequest } from "next/server";
import { getUserFromToken } from "../../auth/authToken";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("auth_jwt")?.value;
    if (!token)
        return new Response(null, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user)
        return new Response(null, { status: 403 });

    const { target }: { target: Cousin } = await req.json();

    if (!target)
        return new Response(null, { status: 400 });

    const YEAR = new Date().getFullYear();

    try {
        // Check that logged in user fetching the wishlist of a person
        // that they are assigned to, or their own wishlist
        if (target != user) {
            const assignedUsers = await sql`
                SELECT person
                FROM assignments
                WHERE 
                    assignedto=${user} AND
                    "year"=${YEAR} AND 
                    person=${target}
            `;
            if (assignedUsers.length === 0)
                return new Response(null, { status: 403 });

            // Fetch target wishlist and claimed items
            const wishlist = await sql`
                SELECT w.*, (
                    SELECT json_agg(json_build_object(
                        'user', c.claimed_by,
                        'comment', c.comment
                    ))
                    FROM claimed_items c
                    WHERE c.item_id = w.id
                ) AS claim_data
                FROM wishlist w
                WHERE w.person = ${target} AND w."year" = ${YEAR}
                ORDER BY w.id ASC;
            `;

            return Response.json(wishlist);
        }
        else {
            // Fetching only the user's wishlist.
            // Don't grab any claim data to avoid spoiling surprises!
            const wishlist = await sql`
                SELECT id, item, links, "desc"
                FROM wishlist
                WHERE
                    person=${target} AND
                    "year"=${YEAR}
                ORDER BY id ASC;
            `;

            return Response.json(wishlist);
        }
    }
    catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }
}