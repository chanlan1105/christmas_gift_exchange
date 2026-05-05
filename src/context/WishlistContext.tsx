import { WishlistItem } from "@/lib/wishlist";
import { createContext, Dispatch, SetStateAction } from "react";

interface WishlistContextType {
    /** Whether or not the AddItemModal is visible. */
    show: boolean,
    /** State function to toggle visibility of the add/edit item modal. */
    setShow: (show: boolean) => void,
    /** The currently active `WishlistItem` for editing, or `null` when no item is active. */
    activeItem: WishlistItem | null,
    /** State function to set the currently active `WishlistItem` for editing, or `null` when no item is active. */
    setActiveItem: (item: WishlistItem | null) => void,
    /** Removes a wishlist item. */
    deleteItem: (id: number) => Promise<void>,
    /** Whether or not the user is currently reordering the wishlist. */
    reordering: boolean,
    /** State function to toggle reordering. */
    setReordering: Dispatch<SetStateAction<boolean>>,
    /** The current state of the wishlist. */
    wishlist: WishlistItem[],
    /** State function to update the wishlist data. */
    setWishlist: Dispatch<SetStateAction<WishlistItem[]>>
};

export const WishlistContext = createContext<null | WishlistContextType>(null);