"use client";

import { Button } from "flowbite-react";
import { BsGiftFill, BsPlus } from "react-icons/bs";
import { WishlistContext } from "@/context/WishlistContext";
import { useContext } from "react";

export default function WishlistHeader() {
    const { setShow, setActiveItem } = useContext(WishlistContext)!;

    return <>
        <h1 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-3 flex-wrap">
            <BsGiftFill />
            <span className="flex-1 text-nowrap">Your wishlist</span>
            <Button pill className="gap-2 text-nowrap" onClick={() => {
                setActiveItem(null);
                setShow(true);
            }}>
                <BsPlus />
                Add item
            </Button>
        </h1>
    </>
}