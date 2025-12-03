"use client";

import { Button } from "flowbite-react";
import { BsGiftFill, BsPlus } from "react-icons/bs";
import AddItemModal from "../components/AddItemModal";
import { useState } from "react";

export default function WishlistHeader() {
    const [show, setShow] = useState<boolean>(false);
    
    return <>
        <h1 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-3 flex-wrap">
            <BsGiftFill />
            <span className="flex-1 text-nowrap">Your wishlist</span>
            <Button pill className="gap-2 text-nowrap" onClick={() => setShow(true)}>
                <BsPlus />
                Add item
            </Button>
        </h1>

        <AddItemModal show={show} setShow={setShow} />
    </>
}