import { NextRequest } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
    const { user } = await req.json();

    if (!user)
        return new Response("Username required", { status: 400 });

    try {
        // Check if user exists and has set password in the database
        const userData = await sql`
            SELECT "user", password
            FROM user_data
            WHERE "user"=${user}
        `;

        if (!userData)
            return new Response("Invalid username.", { status: 404 });

        return Response.json(!!userData[0].password);
    }
    catch (err) {
        return new Response(null, { status: 500 });
    }
}