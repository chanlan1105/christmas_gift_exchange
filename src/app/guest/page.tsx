"use client";

import { Select } from "flowbite-react";
import LogoutAlert from "./components/LogoutAlert";
import { Cousin, cousins, isCousin } from "@/lib/cousins";
import { useState } from "react";
import Wishlist from "./components/Wishlist";

export default function GuestPage() {
    const [selected, setSelected] = useState<Cousin | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <LogoutAlert />

            <h1 className="text-2xl font-bold mt-8 mb-4">You are currently viewing the page as a guest.</h1>

            <p className="my-4">Use the menu below to select a wishlist to view:</p>

            <Select disabled={isLoading} defaultValue="" className="mb-7" onChange={e => {
                const selected = e.target.value;
                if (!isCousin(selected))
                    return;

                setSelected(selected);
            }}>
                <option disabled value="">Select&hellip;</option>
                {cousins.map(cousin => <option key={cousin} value={cousin}>{cousin}</option>)}
            </Select>

            {selected &&
                <Wishlist user={selected} isLoading={isLoading} setIsLoading={setIsLoading} />
            }
        </>
    );
}