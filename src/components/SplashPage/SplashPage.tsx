import PageContext from "@/context/PageContext";
import { useCallback, useContext } from "react";
import PersonCard from "./PersonCard";
import { Alert } from "flowbite-react";
import { BsExclamationTriangleFill } from "react-icons/bs";

export default function SplashPage() {
    const contextValues = useContext(PageContext);
    if (!contextValues) return;
    const { loggedIn, setLoggedIn } = contextValues;

    const logout = useCallback(() => {
        setLoggedIn(null);
    }, []);

    return <>
        <Alert color="warning" rounded icon={BsExclamationTriangleFill} className="font-medium">
            Not {loggedIn}? <span className="font-medium cursor-pointer underline" onClick={logout}>Click to switch users</span>
        </Alert>

        <h1 className="text-2xl font-bold my-4">Hi {loggedIn}!</h1>

        <h2 className="text-xl my-4">This year, you're gifting to:</h2>

        <PersonCard name="Ashley" assignees={["Lucas", "Vanessa"]} />
    </>;
}