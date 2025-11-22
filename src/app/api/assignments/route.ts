import { NextRequest } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: NextRequest) {
    const user = req.cookies.get("user")?.value;
    if (!user)
        return new Response(null, { status: 400 });

    const YEAR = new Date().getFullYear();
    const assignments = await sql`
        SELECT
            A.person,
            ARRAY_AGG(B.assignedto) AS other_gifters
        FROM
            assignments AS A
        INNER JOIN 
            assignments AS B 
        ON 
            A.person=B.person AND
            A.year=B.year
        WHERE
            A.year=${YEAR} AND
            A.assignedto=${user} AND
            B.assignedto!=${user}
        GROUP BY
            A.person;
    `;

    return Response.json(assignments);
}