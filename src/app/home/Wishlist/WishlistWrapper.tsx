import { cookies } from "next/headers";
import Wishlist from "./Wishlist";
import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function WishlistWrapper() {
    const cookieStore = await cookies();
    const wishlistStore = await fetch(`${BASE_URL}/api/wishlist/fetch`, {
        method: "POST",
        headers: {
            "Cookie": cookieStore.toString(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            target: cookieStore.get("user")?.value
        })
    });

    return wishlistStore.ok ?
        <Wishlist wishlistData={await wishlistStore.json()} /> :
        <ErrorAlert errorCode="ERR_WSHLST_USR" options={{ http: wishlistStore.status }} />;
}