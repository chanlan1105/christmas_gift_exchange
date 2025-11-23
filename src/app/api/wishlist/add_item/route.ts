import { sql } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const user = req.cookies.get("user")?.value;
    if (!user)
        return new Response(null, { status: 400 });

    const formData = await req.formData();
    const item = formData.get("item")?.toString();
    const links = formData.getAll("links[]").slice(0, -1).map(l => l.toString());
    const desc = formData.get("desc")?.toString();

    if (!item)
        return new Response(null, { status: 400 });

    try {
        await sql`
            INSERT INTO wishlist ${ sql({
                year: new Date().getFullYear(),
                person: user,
                item,
                links: links ?? null,
                desc: desc || null
            }) } 
        `;
    }
    catch (err) {
        return new Response(null, { status: 500 });
    }

    return new Response(null, { status: 200 });
}