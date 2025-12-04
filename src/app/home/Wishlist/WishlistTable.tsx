"use client";

import { Table, TableHead, TableRow, TableHeadCell, TableBody } from "flowbite-react";
import ItemRow from "../components/ItemRow";
import { WishlistItem } from "@/lib/wishlist";
import ItemCard from "../components/ItemCard";
import { useCallback, useEffect, useState } from "react";
import { WishlistContext } from "@/context/WishlistContext";
import AddItemModal from "../components/AddItemModal";
import { useRouter } from "next/navigation";

/**
 * Displays a wishlist in a responsive table format with mobile and desktop views.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {WishlistItem[]} props.initialWishlist - The initial list of wishlist items to display
 * @returns {JSX.Element} A responsive wishlist table with an edit modal and context provider
 * 
 * @example
 * const items = [{ id: 1, item: 'Book', links: ['url'], desc: 'A great book' }];
 * <WishlistTable initialWishlist={items} />
 * 
 * @remarks
 * - Provides a mobile view using card layout (hidden on sm and up)
 * - Provides a desktop view using a table layout (hidden below sm)
 * - Uses WishlistContext to manage modal state and item operations
 * - Syncs internal state with initialWishlist prop changes
 * - Includes delete functionality with confirmation dialog
 */
export default function WishlistTable({ initialWishlist }: { initialWishlist: WishlistItem[] }) {
    const [show, setShow] = useState(false);
    const [wishlist, setWishlist] = useState(initialWishlist);
    const [activeItem, setActiveItem] = useState<null | WishlistItem>(null);
    const router = useRouter();

    // Update internal state when new wishlist data is passed
    useEffect(() => {
        setWishlist(initialWishlist);
    }, [initialWishlist]);

    const deleteItem = useCallback((id: number) => {
        if (!confirm("Are you sure you want to delete this item? This cannot be reversed."))
            return;

        fetch("/api/wishlist/item", {
            method: "DELETE",
            body: JSON.stringify({
                id
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok)
                router.refresh();
            else 
                alert("There was an error deleting this item. Error code: ERR_WSHLST_DEL. HTTP status: " + res.status);
        });
    }, []);

    return <WishlistContext.Provider value={{
        setShow, setActiveItem, deleteItem
    }}>
        { /* Mobile view */ }
        <div className="sm:hidden space-y-3">
            {
                wishlist.map((item: WishlistItem) =>
                    <ItemCard id={item.id} item={item.item} links={item.links} desc={item.desc} key={item.id} />
                )
            }
        </div>
        
        { /* Desktop view */ }
        <Table className="hidden sm:table">
            <TableHead>
                <TableRow>
                    <TableHeadCell>Item</TableHeadCell>
                    <TableHeadCell>Links</TableHeadCell>
                    <TableHeadCell>Comment</TableHeadCell>
                    <TableHeadCell className="w-0 px-0"></TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody className="divide-y">
                {
                    wishlist.map((item: WishlistItem) =>
                        <ItemRow item={item} controls={true} key={item.id} />
                    )
                }
            </TableBody>
        </Table>

        { /* Edit item modal */ }
        <AddItemModal show={show} setShow={setShow} values={activeItem} />
    </WishlistContext.Provider>;
}