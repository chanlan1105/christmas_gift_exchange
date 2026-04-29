"use client";

import ItemRow from "../components/ItemRow";
import { WishlistItem } from "@/lib/wishlist";
import { useCallback, useEffect, useState } from "react";
import { WishlistContext } from "@/context/WishlistContext";
import AddItemModal from "../components/AddItemModal";
import { useRouter } from "next/navigation";

export default function WishlistTable({ initialWishlist, controls }: { initialWishlist: WishlistItem[], controls: boolean }) {
    const [show, setShow] = useState(false);
    const [wishlist, setWishlist] = useState(initialWishlist);
    const [activeItem, setActiveItem] = useState<null | WishlistItem>(null);
    const router = useRouter();

    // Update internal state when new wishlist data is passed
    useEffect(() => {
        setWishlist(initialWishlist);
    }, [initialWishlist]);

    const deleteItem = useCallback(async (id: number) => {
        if (!confirm("Are you sure you want to delete this item? This cannot be reversed."))
            return;

        const res = await fetch("/api/wishlist/item", {
            method: "DELETE",
            body: JSON.stringify({
                id
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.ok)
            router.refresh();
        else
            alert("There was an error deleting this item. Error code: ERR_WSHLST_DEL. HTTP status: " + res.status);
    }, []);

    return <WishlistContext.Provider value={{
        setShow, setActiveItem, deleteItem
    }}>
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

        { /* Edit item modal */}
        <AddItemModal show={show} setShow={setShow} values={activeItem} />
    </WishlistContext.Provider>;
}