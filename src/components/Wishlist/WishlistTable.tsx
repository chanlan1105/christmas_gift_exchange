"use client";

import ItemRow from "./ItemRow";
import { WishlistItem } from "@/lib/wishlist";
import { useContext } from "react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { WishlistContext } from "@/context/WishlistContext";
import ErrorAlert from "../ErrorAlert/ErrorAlert";
import { DragDropProvider } from "@dnd-kit/react";

function SortableRow({ item, controls, index }: { item: WishlistItem, controls: boolean, index: number }) {
    const { ref, handleRef } = useSortable({ id: item.id, index });

    return <li ref={ref} className="item list-row flex data-dnd-dragging:shadow-md data-dnd-dragging:bg-base-200/50">
        <ItemRow item={item} controls={controls} handleRef={handleRef} key={item.id} />
    </li>
}

export default function WishlistTable({ staticWishlist, controls }: { staticWishlist?: WishlistItem[], controls: boolean }) {
    const wishlistContext = useContext(WishlistContext);
    const wishlist = staticWishlist ?? wishlistContext?.wishlist;

    if (!wishlist) {
        // A static wishlist was not provided, and context was not found. This should never happen.
        return <ErrorAlert errorCode="ERR_WSHLST_TABLE" />;
    }

    return <DragDropProvider
        onDragEnd={(event) => {
            if (event.canceled) return;

            // Make sure the drag event originated from a sortable element
            const { source } = event.operation;
            if (!isSortable(source)) return;

            // Make sure the item was moved to a different position
            const { initialIndex, index } = source;
            if (initialIndex === index) return;

            // Make sure we have access to the context
            if (!wishlistContext) return;

            const { setWishlist, setReordering } = wishlistContext;
            const newWishlist = [...wishlist];

            // Splice out the item which we have reordered
            const [removed] = newWishlist.splice(initialIndex, 1);

            // Splice it back in at the target index
            newWishlist.splice(index, 0, removed);

            setWishlist(newWishlist);
        }}
    >
        <ul className={`
            list mb-2 mr-2
            bg-base-100 shadow-md
            border border-gray-200 dark:border-gray-800 rounded-box
        `}>
            {
                wishlist.map((item: WishlistItem, index: number) =>
                    <SortableRow item={item} controls={controls} index={index} key={item.id} />
                )
            }
        </ul>
    </DragDropProvider>;
}