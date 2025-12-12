import { WishlistItem } from "@/lib/wishlist";
import { createContext, Dispatch, SetStateAction } from "react";

interface WishlistContextType {
    /** State function to toggle visibility of the add/edit item modal. */
    setShow: Dispatch<SetStateAction<boolean>>,
    /** State function to set the currently active `WishlistItem` for editing, or `null` when no item is active. */
    setActiveItem: Dispatch<SetStateAction<WishlistItem | null>>,
    /** Removes a wishlist item. */
    deleteItem: (id: number) => Promise<void>
};

export const WishlistContext = createContext<null | WishlistContextType>(null);