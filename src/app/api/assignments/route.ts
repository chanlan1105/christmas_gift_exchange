import { sql } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const user = req.cookies.get("user")?.value;
    if (!user)
        return new Response(null, { status: 401 });

    const YEAR = new Date().getFullYear();
    const assignments = await sql`
        SELECT
            -- Select the gift recipient (i.e., the assignee)
            A.person,

            -- Select all other gifters assigned to the same person, excluding the current user
            COALESCE(
                ARRAY_AGG(B.assignedto) FILTER (WHERE B.assignedto!=${user}),
                ARRAY[]::TEXT[]
            ) AS other_gifters
        FROM
            assignments AS A
        INNER JOIN 
            assignments AS B 
        ON 
            A.person=B.person AND
            A.year=B.year
        WHERE
            A.year=${YEAR} AND
            A.assignedto=${user}
        GROUP BY
            A.person;
    `;

    return Response.json(assignments);
}