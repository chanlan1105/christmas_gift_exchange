"use client";

import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import { WishlistContext } from "@/context/WishlistContext";
import { noLinkProvidedText, WishlistItem } from "@/lib/wishlist";
import { TableCell, TableRow } from "flowbite-react"
import { useContext, useTransition } from "react";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import ClaimControl from "./ClaimControl";

interface ItemRowDetails {
    item: WishlistItem,
    controls: boolean,
    claimable?: boolean,
    loggedInUser?: string
};

export default function ItemRow({
    item: { id, item, links, desc, claim_data },
    controls,
    claimable,
    loggedInUser
}: ItemRowDetails) {
    // Fetch context values, if needed, for edit and delete controls
    const contextValues = controls ? useContext(WishlistContext) : null;

    if (!contextValues && controls)
        return <ErrorAlert errorCode="ERR_WSHLST_ITEMROW_CXT" />;

    const {
        setShow = () => { },
        setActiveItem = () => { },
        deleteItem = () => { }
    } = contextValues || {};

    const [deletePending, startDeleteTransition] = useTransition();

    return <li className="list-row flex">
        <div className="flex flex-col grow self-center">
            <h3 className="font-semibold text-base">{item}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-200">{desc}</p>

            <div className="list-col-wrap text-gray-600 dark:text-gray-200 flex flex-col mt-2">
                {
                    links.length ?
                        links.map(link =>
                            <a href={link} target="_blank" key={link} className="w-fit hover:underline line-clamp-3">{link}</a>
                        ) :
                        noLinkProvidedText
                }
            </div>
        </div>
        {
            /* Render add/edit controls */
            controls &&
            <div className="flex flex-col sm:flex-row sm:gap-2">
                <button className="btn btn-square btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Edit item" onClick={() => {
                    setActiveItem({ id, item, links: [...links, ""], desc });
                    setShow(true);
                }}>
                    <BsPencilFill />
                </button>
                <button className={`
                    btn btn-square btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800
                    ${deletePending ? "cursor-not-allowed" : "cursor-pointer"}
                    ${deletePending ? "opacity-70" : ""}
                `} onClick={() => {
                        if (deletePending) return;

                        startDeleteTransition(async () => {
                            await deleteItem(id);
                        });
                    }}>
                    {deletePending ? <span className="loading loading-spinner"></span> : <BsTrashFill />}
                </button>
            </div>
        }
        {
            /* Render claim controls */
            claimable && !controls &&
            <div className="flex flex-col sm:flex-row sm:gap-2">
                <ClaimControl itemId={id} claimData={claim_data} loggedInUser={loggedInUser} />
            </div>
        }
    </li>;
}