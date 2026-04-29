import { Cousin } from "@/lib/cousins";
import { sql } from "@/lib/db";
import { NextRequest } from "next/server";
import { getUserFromToken } from "../../auth/authToken";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("auth_jwt")?.value;
    const user = token ? await getUserFromToken(token) : null;

    const { target }: { target: Cousin } = await req.json();

    if (!target)
        return new Response(null, { status: 400 });

    const YEAR = new Date().getFullYear();

    try {
        if (user && target != user) {
            // Check if we are assigned to the target person
            const assignedUsers = await sql`
                SELECT person
                FROM assignments
                WHERE 
                    assignedto=${user} AND
                    "year"=${YEAR} AND 
                    person=${target}
            `;

            if (assignedUsers.length != 0) {
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
        }

        // Otherwise, we fetch the wishlist only.
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
    catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }
}