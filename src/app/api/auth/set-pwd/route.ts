import { NextRequest } from "next/server";
import { isCousin } from "@/lib/cousins";
import { sql } from "@/lib/db";
import bcrypt from "bcrypt";
import { EXPIRY, generateToken } from "../authToken";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
    const { user, password } = await req.json();

    if (!user || !password)
        return new Response(null, { status: 400 });

    if (!isCousin(user))
        return new Response("Invalid username", { status: 403 });

    // Check if user already has a password in the database
    const db_pwd = await sql`
        SELECT "user"
        FROM user_data
        WHERE "user"=${user} AND password IS NOT NULL
    `;
    if (db_pwd.length)
        return new Response("Password already set", { status: 403 });

    // Salt and hash the password to store in database
    const hash = await bcrypt.hash(password, 10);
    await sql`
        UPDATE user_data
        SET password=${hash}
        WHERE "user"=${user}
    `;

    // Generate a JWT to save to client cookies
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