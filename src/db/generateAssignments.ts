import { Cousin, cousins, exclusion } from "@/lib/cousins";
import { readFile } from "fs/promises";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function createAssignmentsTable() {
    await readFile("./generateAssignments.sql", { encoding: "utf-8" }).then(query => {
        sql(query);
    });
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

console.log(generateAssignments(3));