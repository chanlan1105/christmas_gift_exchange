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
    deleteItem: (id: number) => Promise<void>
};

export const WishlistContext = createContext<null | WishlistContextType>(null);