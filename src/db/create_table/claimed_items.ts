import { sql } from "@/lib/db";

await sql`
    CREATE TABLE IF NOT EXISTS claimed_items (
        id SERIAL PRIMARY KEY,
        item_id INT4 NOT NULL,
        claimed_by TEXT NOT NULL,
        comment TEXT,
        CONSTRAINT fk_item
            FOREIGN KEY (item_id)
            REFERENCES wishlist(id)
            ON DELETE CASCADE,
        CONSTRAINT fk_user
            FOREIGN KEY (claimed_by)
            REFERENCES user_data ("user")
            ON DELETE CASCADE
    );
`;

process.exit(0);
