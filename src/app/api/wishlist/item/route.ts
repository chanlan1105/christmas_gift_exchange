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

    const formData = await req.formData();
    const item = formData.get("item")?.toString();
    const links = formData.getAll("links[]").slice(0, -1).map(l => l.toString());
    const desc = formData.get("desc")?.toString();

    if (!item)
        return new Response(null, { status: 400 });

    try {
        const [newItem] = await sql`
            INSERT INTO wishlist ${ sql({
                year: new Date().getFullYear(),
                person: user,
                item,
                links: sql.json(links),
                desc: desc || null
            }) } 
            RETURNING id, item, links, "desc"
        `;

        return Response.json({
            ...newItem,
            links: Array.isArray(newItem.links) ? newItem.links : (newItem.links ? JSON.parse(newItem.links) : []),
            desc: newItem.desc ?? ""
        }, { status: 201 });
    }
    catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const token = req.cookies.get("auth_jwt")?.value;
    if (!token)
        return new Response(null, { status: 401 });
    
    const user = await getUserFromToken(token);
    if (!user)
        return new Response(null, { status: 403 });

    // Parse formData
    const formData = await req.formData();
    const id = formData.get("id")?.toString();
    const item = formData.get("item")?.toString();
    const links = formData.getAll("links[]").slice(0, -1).map(l => l.toString());
    const desc = formData.get("desc")?.toString();

    if (id == null)
        return new Response(null, { status: 400 });
    if (item == null || item == "")
        return new Response(null, { status: 400 });

    try {
        // Check that the wishlist item actually belongs to the user
        // and update the database
        const [updatedItem] = await sql`
            UPDATE wishlist
            SET ${
                sql({
                    item,
                    links: sql.json(links),
                    desc: desc || null
                })
            }
            WHERE
                person=${user} AND
                id=${id}
            RETURNING
                id, item, links, "desc"
        `;

        if (!updatedItem)
            return new Response(null, { status: 403 });

        return Response.json({
            ...updatedItem,
            links: Array.isArray(updatedItem.links) ? updatedItem.links : (updatedItem.links ? JSON.parse(updatedItem.links) : []),
            desc: updatedItem.desc ?? ""
        }, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const token = req.cookies.get("auth_jwt")?.value;
    if (!token)
        return new Response(null, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user)
        return new Response(null, { status: 403 });

    const data = await req.json();
    const id = data.id;

    if (id == null)
        return new Response(null, { status: 400 });

    try {
        const result = await sql`
            DELETE FROM wishlist
            WHERE
                id=${id} AND
                person=${user}
            RETURNING id
        `;

        if (result.length === 0)
            return new Response(null, { status: 403 });
        else
            return new Response(null, { status: 204 });
    }
    catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }
}