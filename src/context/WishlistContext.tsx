import { WishlistItem } from "@/lib/wishlist";
import { createContext, Dispatch, SetStateAction } from "react";

interface WishlistContextType {
    setShow: Dispatch<SetStateAction<boolean>>,
    setActiveItem: Dispatch<SetStateAction<WishlistItem | null>>,
    deleteItem: (id: number) => void
};

export const WishlistContext = createContext<null | WishlistContextType>(null);