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
                    "year"=${YEAR}
            `;
            if (!assignedUsers.map(({ person }) => person).includes(target))
                return new Response(null, { status: 403 });
        }

        // Fetch target wishlist
        const wishlist = await sql`
            SELECT id, item, links, "desc"
            FROM wishlist
            WHERE
                person=${target} AND
                "year"=${YEAR}
        `;

        return Response.json(wishlist);
    }
    catch (err) {
        return new Response(null, { status: 500 });
    }
}