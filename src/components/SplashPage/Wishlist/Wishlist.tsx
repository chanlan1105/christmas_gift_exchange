import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import { WishlistItem } from "@/lib/wishlist";
import { cookies } from "next/headers";
import WishlistHeader from "./WishlistHeader/WishlistHeader";
import WishlistTable from "./WishlistTable/WishlistTable";

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

    const wishlist: WishlistItem[] = await wishlistStore.json();

    return <>
        <WishlistHeader />

        <div className="overflow-x-auto">
            {
                wishlistStore.ok ?
                <WishlistTable initialWishlist={wishlist} /> :
                <ErrorAlert errorCode="ERR_WSHLST_USR" />
            }
        </div>
    </>;
}