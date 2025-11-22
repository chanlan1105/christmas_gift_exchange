import { serialize } from "cookie";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    return new Response(null, {
        status: 200,
        headers: {
            'Set-Cookie': serialize("user", "", {
                path: "/",
                maxAge: 0,
                expires: new Date(0)
            })
        }
    });
}