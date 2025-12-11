import { sql } from "@/lib/db";
import { NextRequest } from "next/server";
import { EXPIRY, generateToken } from "../authToken";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
    const { user, password } = await req.json();

    if (!user || !password)
        return new Response(null, { status: 400 });

    // Check if password matches hash
    const hash = await sql`
        SELECT password
        FROM user_data
        WHERE "user"=${user}
    `;
    if (!hash.length)
        return new Response(null, { status: 403 });

    const valid = await bcrypt.compare(password, hash[0].password);
    if (!valid)
        return new Response("Invalid", { status: 403 });

    // Generate a new JWT and send back to the client
    const token = await generateToken(user);

    return new Response(user, {
        status: 201,
        headers: {
            "Set-Cookie": [
                serialize("auth_jwt", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV == "production",
                    path: "/",
                    sameSite: "strict",
                    maxAge: EXPIRY
                }),
                serialize("user", user, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV == "production",
                    path: "/",
                    sameSite: "strict",
                    maxAge: EXPIRY
                })
            ].join(",")
        }
    });
}