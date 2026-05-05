"use client";

import { Button, Spinner } from "flowbite-react";
import { BsArrowDownUp, BsCheckLg, BsGiftFill, BsPlus } from "react-icons/bs";
import { WishlistContext } from "@/context/WishlistContext";
import { useCallback, useContext, useTransition } from "react";
import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function WishlistHeader() {
    const wishlistContext = useContext(WishlistContext);
    if (!wishlistContext) {
        return <ErrorAlert errorCode="ERR_WSHLST_HDR_CXT" />;
    }
    const { setShow, setActiveItem, reordering, setReordering, wishlist } = wishlistContext;

    const [pending, startTransition] = useTransition();

    const reorder = useCallback(() => {
        return new Promise<boolean>(resolve => {
            startTransition(async () => {
                const res = await fetch(`${BASE_URL}/api/wishlist/reorder`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(
                        wishlist.map((item, index) => [item.id, index])
                    )
                });

                if (!res.ok) {
                    alert("There was an error reordering your wishlist. Please try again and contact me if the error persists. Error code: ERR_WSHLST_RORD, HTTP status: " + res.status);
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            })
        });
    }, [wishlist]);

    return <>
        <h1 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-3 flex-wrap">
            <BsGiftFill />
            <span className="flex-1 text-nowrap">Your wishlist</span>
            <Button
                disabled={pending}
                color={reordering ? "green" : "default"}
                pill
                className="gap-2 text-nowrap transition-colors"
                onClick={async () => {
                    if (reordering) {
                        const res = await reorder();
                        if (!res) return;
                    }
                    setReordering((r: boolean) => !r);
                }}
            >
                {
                    pending ?
                        <Spinner size="sm" /> :
                    reordering ?
                        <BsCheckLg /> :
                        <BsArrowDownUp />
                }
                {reordering ? "Save" : "Reorder"}
            </Button>
            <Button pill className="gap-2 text-nowrap pl-3 transition-colors" onClick={() => {
                setActiveItem(null);
                setShow(true);
            }} disabled={reordering}>
                <BsPlus className="w-5 h-5" />
                Add item
            </Button>
        </h1>
    </>
}