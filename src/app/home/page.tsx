import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import Assignments from "@/app/home/Assignments/Assignments";
import LogoutAlert from "@/app/home/components/LogoutAlert";
import Wishlist from "@/app/home/Wishlist/Wishlist";
import { cookies } from "next/headers";

export default async function SplashPage() {
    const loggedIn = (await cookies()).get("user")?.value;

    if (!loggedIn) {
        return <ErrorAlert errorCode="ERR_SPLASH_PG_USR" />;
    }

    return <>
        <LogoutAlert loggedIn={loggedIn} />

        <h1 className="text-2xl font-bold mt-8 mb-4">Hi {loggedIn}!</h1>

        <h2 className="text-xl my-4">This year, you're gifting to:</h2>

        <Assignments />

        <Wishlist />
    </>;
}