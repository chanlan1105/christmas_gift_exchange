import { cousins } from "@/lib/cousins";
import { sql } from "@/lib/db";

const USER_DATA_TABLE = "user_data";

// Create table if it doesn't exist
await sql`
    CREATE TABLE IF NOT EXISTS ${sql(USER_DATA_TABLE)} (
        id SERIAL PRIMARY KEY,
        "user" TEXT,
        password TEXT
    );
`;

// Ensure users are unique
await sql`
    ALTER TABLE ${sql(USER_DATA_TABLE)}
    ADD CONSTRAINT unique_username
    UNIQUE ("user");
`;

// Populate the table
await sql`
    INSERT INTO ${sql(USER_DATA_TABLE)}
    ${ sql(cousins.map(c => ({ user: c })), "user") }
    ON CONFLICT ("user") DO NOTHING;
`;

process.exit(0);