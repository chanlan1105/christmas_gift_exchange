import { Cousin } from "@/lib/cousins";
import PersonCard from "./PersonCard";
import ErrorAlert from "../ErrorAlert/ErrorAlert";
import { cookies } from "next/headers";

type Assignment = {
    person: Cousin,
    other_gifters: Cousin[]
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function Assignments() {
    const cookieStore = await cookies();

    const assignmentsStore = await fetch(`${BASE_URL}/api/assignments`, {
        method: "POST",
        headers: {
            "Cookie": cookieStore.toString()
        }
    });
    
    if (!assignmentsStore.ok)
        return <ErrorAlert errorCode="ERR_ASSMTS_USR" />

    const assignments: Assignment[] = await assignmentsStore.json();

    return assignments.map(({ person, other_gifters }) =>
        <PersonCard name={person} key={person} assignees={other_gifters} />
    );
}