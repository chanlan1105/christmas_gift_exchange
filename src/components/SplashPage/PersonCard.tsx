import { Cousin } from "@/lib/cousins";
import { Card } from "flowbite-react";
import { cookies } from "next/headers";
import ErrorAlert from "../ErrorAlert/ErrorAlert";

export default async function PersonCard({ name, assignees }: { name: Cousin, assignees: Cousin[] }) {
    const loggedIn = (await cookies()).get("user")?.value;
    
        if (!loggedIn) {
            return <ErrorAlert errorCode="ERR_PSN_CD_USR" />;
        }

    const otherAssignees = assignees.filter(a => a != loggedIn);
    return <Card className="max-w-md mb-3">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
        </h5>
        <p className="text-gray-600 dark:text-gray-200 text-sm">
            {otherAssignees.join(", ")} also {otherAssignees.length == 1 ? "has" : "have"} {name}
        </p>
    </Card>;
}