import { sql } from "@/lib/db";
import { NextRequest } from "next/server";
import { getUserFromToken } from "../../auth/authToken";

export async function PUT(req: NextRequest) {
    const token = req.cookies.get("auth_jwt")?.value;
    if (!token)
        return new Response(null, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user)
        return new Response(null, { status: 403 });

    const rawData = await req.json();
    const data = rawData.map(([id, rank]: [any, any]) => [Number(id), Number(rank)]);
    
    await sql`
        UPDATE wishlist
        SET rank = data.rank::int
        FROM (values ${sql(data)}) AS data(id, rank)
        WHERE wishlist.id = data.id::int AND wishlist.person = ${user};
    `;

    return new Response(null, { status: 204 });
}