import PageContext from "@/context/PageContext";
import { Cousin } from "@/lib/cousins";
import { Card } from "flowbite-react";
import { useContext } from "react";

export default function PersonCard({ name, assignees }: { name: Cousin, assignees: Cousin[] }) {
    const contextValues = useContext(PageContext);
    if (!contextValues) return;
    const { loggedIn } = contextValues;

    const otherAssignees = assignees.filter(a => a != loggedIn);
    return <Card className="max-w-md">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
        </h5>
        <p className="text-gray-600 dark:text-gray-200 text-sm">
            {otherAssignees.length} other {otherAssignees.length == 1 ? "person is" : "people are"} gifting to {name}: {otherAssignees.join(", ")}
        </p>
    </Card>;
}