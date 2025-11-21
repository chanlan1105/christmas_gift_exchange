import { Cousin, cousins, exclusion } from "@/lib/cousins";
import postgres from "postgres";
import "dotenv/config";

import { createInterface } from "readline/promises";
const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function createAssignmentsTable() {
    await sql`CREATE TABLE IF NOT EXISTS Assignments (
        id SERIAL PRIMARY KEY,
        "year" INTEGER,
        person VARCHAR(127),
        assignedto VARCHAR(127)
    );`;

    return;
}

/**
 * Generates `n` random gift assignments for each person
 * @param {number} n How many gifts each person should give
 */
function generateAssignments(n: number): Record<Cousin, Cousin[]> {
    if (n >= cousins.length) 
        throw new Error(`Cannot generate ${n} assignments with only ${cousins.length} cousins`);

    const assignments: Record<Cousin, Cousin[]> = Object.fromEntries(
        cousins.map(c => [c, []]) as [Cousin, Cousin[]][]
    ) as Record<Cousin, Cousin[]>;

    for (let i = 0; i < n; i++) {
        // Whether or not assignments were successfuly generated for this iteration
        let success = true;

        // Try and generate assignments until a valid match is found.
        do {
            // Temporary variable to store assignments until we guarantee they are all valid
            const _assignments: {
                [k: string]: Cousin
            } = {};

            // Recipients already assigned for this iteration
            const assigned: Cousin[] = [];

            // Assume that this iteration will succeed. If not, the success flag
            // will explicitly be set to false.
            success = true;

            for (const gifter of cousins) {
                // Create list of valid recipients and choose one at random
                const validRecipients = cousins.filter(c =>
                    c != gifter &&   // Gifter is not receiver
                    !exclusion[gifter]?.includes(c) &&  // Receiver is not in exclusion list
                    !assignments[gifter].includes(c) && // Gifter not already gifting to receiver in a previous round
                    !assigned.includes(c)               // Receiver has not already been assigned
                );

                // Check if no valid recipients.
                if (validRecipients.length == 0) {
                    success = false;

                    // Break out of loop and start again.
                    break;
                }

                // Select a recipient at random
                const selected = validRecipients[Math.floor(Math.random() * validRecipients.length)];

                // Save selected recipient
                _assignments[gifter] = selected;
                assigned.push(selected);
            }
            
            if (success) {
                console.log(`Successfully assigned round ${i + 1} of gifters.`);

                // Add temporary assignments to permanent object.
                for (const cousin of cousins) {
                    assignments[cousin].push(_assignments[cousin]);
                }
            }
        }
        while (!success);
    }

    return assignments;
}

/** 
 * Writes `n` assignments to the SQL server.
 */
async function writeAssignments(n: number) {
    const assignments = generateAssignments(n);

    // Check if records already exist for this year.
    const YEAR = new Date().getFullYear();
    const records = await sql`
        SELECT COUNT(id) FROM Assignments WHERE "year"=${YEAR} 
    `;
    const count = parseInt(records[0].count, 10);

    if (count) {
        // Records already exist.
        const answer = await readline.question(`Assignments already exist for year ${YEAR}. Overwrite? [y/n] `);

        if (!["y", "yes"].includes(answer.toLowerCase()))
            return false;

        // Delete existing records
        await sql`DELETE FROM Assignments WHERE "year"=${YEAR}`;
    }

    const sqlAssignments = Object.entries(assignments).flatMap(([gifter, list]) => {
        return list.map(person => ({
            year: YEAR,
            assignedto: gifter,
            person
        }));
    });

    await sql`INSERT INTO Assignments ${ sql(sqlAssignments, "year", "assignedto", "person") }`;

    return true;
}

await createAssignmentsTable();
writeAssignments(2).then(res => {
    res && console.log("Done!");
    process.exit(0);
});