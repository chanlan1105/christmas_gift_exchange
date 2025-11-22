import { Cousin, isCousin } from "@/lib/cousins";
import { serialize } from "cookie";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const name: Cousin = isCousin(body.name) ? body.name : "";

    // If name is not a cousin, return HTTP 400
    if (!name)
        return new Response("Invalid login name", { status: 400 });

    // Otherwise, set cookie and return HTTP 200
    return new Response(null, {
        status: 200,
        headers: {
            'Set-Cookie': serialize("user", name, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
                path: "/",
                sameSite: "lax",
                maxAge: 60 * 60 * 6
            })
        }
    });
}