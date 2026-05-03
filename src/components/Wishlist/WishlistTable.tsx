"use client";

import ItemRow from "./ItemRow";
import { WishlistItem } from "@/lib/wishlist";
import { useEffect, useState } from "react";

export default function WishlistTable({ initialWishlist, controls }: { initialWishlist: WishlistItem[], controls: boolean }) {
    const [wishlist, setWishlist] = useState(initialWishlist);

    // Update internal state when new wishlist data is passed
    useEffect(() => {
        setWishlist(initialWishlist);
    }, [initialWishlist]);

    return <>
        <ul className={`
            list mb-2 mr-2
            bg-base-100 shadow-md
            border border-gray-200 dark:border-gray-800 rounded-box
        `}>
            {
                wishlist.map((item: WishlistItem) =>
                    <ItemRow item={item} controls={controls} key={item.id} />
                )
            }
        </ul>
    </>;
}