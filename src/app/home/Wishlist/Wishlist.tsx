"use client";

import WishlistTable from "@/components/Wishlist/WishlistTable";
import { WishlistContext } from "@/context/WishlistContext";
import { WishlistItem } from "@/lib/wishlist";
import WishlistHeader from "./WishlistHeader";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import AddItemModal from "@/components/Wishlist/AddItemModal";

export default function Wishlist({ wishlistData }: { wishlistData: WishlistItem[] }) {
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [activeItem, setActiveItem] = useState<null | WishlistItem>(null);

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
        show, setShow,
        activeItem, setActiveItem,
        deleteItem
    }}>
        <WishlistHeader />

        <div className="overflow-x-auto">
            <WishlistTable initialWishlist={wishlistData} controls={true} />
        </div>

        <AddItemModal />
    </WishlistContext.Provider>;
}