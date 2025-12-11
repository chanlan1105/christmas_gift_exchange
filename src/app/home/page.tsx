import Assignments from "@/app/home/Assignments/Assignments";
import LogoutAlert from "@/app/home/components/LogoutAlert";
import Wishlist from "@/app/home/Wishlist/Wishlist";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromToken } from "../api/auth/authToken";

export default async function SplashPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_jwt")?.value;
    const user = cookieStore.get("user")?.value;
    if (!token || !user)
        return redirect("/login");

    const loggedIn = await getUserFromToken(token);
    if (!loggedIn || loggedIn != user)
        return redirect("/login");

    return <>
        <LogoutAlert loggedIn={loggedIn} />

        <h1 className="text-2xl font-bold mt-8 mb-4">Hi {loggedIn}!</h1>

        <h2 className="text-xl my-4">This year, you're gifting to:</h2>

        <Assignments />

        <Wishlist />
    </>;
}