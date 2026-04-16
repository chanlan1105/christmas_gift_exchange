import { sql } from "@/lib/db";

await sql`
    CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        "year" INTEGER,
        person VARCHAR(127),
        item TEXT,
        links JSON,
        "desc" TEXT
    );
`;

process.exit(0);