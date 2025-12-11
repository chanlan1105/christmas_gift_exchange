import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import { cookies } from "next/headers";
import WishlistHeader from "./WishlistHeader";
import WishlistTable from "./WishlistTable";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function Wishlist() {
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

    return <>
        <WishlistHeader />

        <div className="overflow-x-auto">
            {
                wishlistStore.ok ?
                <WishlistTable initialWishlist={await wishlistStore.json()} /> :
                <ErrorAlert errorCode="ERR_WSHLST_USR" options={{ http: wishlistStore.status }} />
            }
        </div>
    </>;
}