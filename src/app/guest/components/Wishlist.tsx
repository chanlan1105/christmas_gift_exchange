"use client";

import WishlistTable from "@/components/Wishlist/WishlistTable";
import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { BsBasket3 } from "react-icons/bs";

export default function Wishlist(
    { user, isLoading, setIsLoading }: { user: string, isLoading: boolean, setIsLoading: (loading: boolean) => void }
) {
    const [wishlist, setWishlist] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setError(false);

        fetch(`/api/wishlist/fetch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                target: user
            })
        })
            .then(async res => {
                if (!res.ok) {
                    setError(true);
                } else {
                    setWishlist(await res.json());
                }
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user]);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Spinner size="xl" /></div>;
    }

    if (error || !wishlist) {
        return <ErrorAlert errorCode="ERR_WSHLST_GUEST" />;
    }

    if (wishlist.length == 0) {
        return <div className="alert" role="alert"><BsBasket3 />{user}'s wishlist is empty!</div>;
    }
    else {
        return <WishlistTable initialWishlist={wishlist} controls={false} />;
    }
}