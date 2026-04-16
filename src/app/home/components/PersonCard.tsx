import { Cousin } from "@/lib/cousins";
import { Card, Table, TableBody, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { cookies } from "next/headers";
import ErrorAlert from "../../../components/ErrorAlert/ErrorAlert";
import { BsChevronRight, BsGift } from "react-icons/bs";
import ItemRow from "./ItemRow";
import ItemCard from "./ItemCard";
import { WishlistItem } from "@/lib/wishlist";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function PersonCard({ name, assignees }: { name: Cousin, assignees: Cousin[] }) {
    const loggedIn = (await cookies()).get("user")?.value;

    if (!loggedIn) {
        return <ErrorAlert errorCode="ERR_PSN_CD_USR" />;
    }

    let wishlistStore, wishlist;

    try {
        const cookieStore = await cookies();
        wishlistStore = await fetch(`${BASE_URL}/api/wishlist/fetch`, {
            method: "POST",
            body: JSON.stringify({
                target: name
            }),
            headers: {
                "Cookie": cookieStore.toString(),
                "Content-Type": "application/json"
            }
        });

        if (!wishlistStore.ok)
            return <ErrorAlert errorCode="ERR_PSN_CD_WSHLST" options={{ http: wishlistStore.status }} />;

        wishlist = await wishlistStore.json();
    }
    catch (err) {
        console.error(err);
        return <ErrorAlert errorCode="ERR_PSN_CD_WSHLST" options={{ console: true }} />
    }

    const otherAssignees = assignees.filter(a => a != loggedIn);
    return <Card className="max-w-xl mb-3">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
        </h5>
        <p className="text-gray-600 dark:text-gray-200 text-sm">
            {otherAssignees.join(", ")} also {otherAssignees.length == 1 ? "has" : "have"} {name}
        </p>

        { /* Mobile view */}
        <div className="collapse sm:hidden">
            <input type="checkbox" className="peer" />

            <p className="
                text-gray-800 dark:text-gray-100
                inline-flex items-center gap-3
                collapse-title
                peer-checked:[&>svg.transform]:rotate-90
            ">
                <BsGift /> View wishlist ({wishlist.length}) <BsChevronRight className="transition-transform transform" />
            </p>

            <div className="collapse-content overflow-x-auto overflow-y-hidden">
                <div className="space-y-3 mt-3">
                    {
                        wishlist.map((item: WishlistItem) =>
                            <ItemCard item={item} controls={false} key={item.id} />
                        )
                    }
                </div>
            </div>
        </div>

        { /* Desktop view */}
        <div className="hidden sm:block">
            <label htmlFor={`modal-${name.replace(/\s+/g, '-')}`} className="
                text-gray-800 dark:text-gray-100
                inline-flex items-center gap-3
                collapse-title w-full cursor-pointer
            ">
                <BsGift /> View wishlist ({wishlist.length}) <BsChevronRight className="transition-transform transform" />
            </label>

            <input type="checkbox" id={`modal-${name.replace(/\s+/g, '-')}`} className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box w-11/12 max-w-5xl bg-white dark:bg-gray-800">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{name}&apos;s Wishlist</h3>

                    <div className="overflow-x-auto">
                        <Table className="table w-full">
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell>Item</TableHeadCell>
                                    <TableHeadCell>Links</TableHeadCell>
                                    <TableHeadCell>Comment</TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y">
                                {
                                    wishlist.map((item: WishlistItem) =>
                                        <ItemRow item={item} controls={false} key={item.id} />
                                    )
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <label className="modal-backdrop" htmlFor={`modal-${name.replace(/\s+/g, '-')}`}>Close</label>
            </div>
        </div>
    </Card>;
}