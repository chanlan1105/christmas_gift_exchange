"use client";

import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import { WishlistContext } from "@/context/WishlistContext";
import { noLinkProvidedText, WishlistItem } from "@/lib/wishlist";
import { useContext, useTransition } from "react";
import { BsGripVertical, BsPencilFill, BsTrashFill } from "react-icons/bs";
import ClaimControl from "./ClaimControl";

interface ItemRowDetails {
    item: WishlistItem,
    controls: boolean,
    handleRef?: (element: HTMLElement | null) => void,
    claimable?: boolean,
    loggedInUser?: string
};

export default function ItemRow({
    item: { id, item, links, desc, claim_data },
    controls,
    handleRef,
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
        deleteItem = () => { },
        reordering = false
    } = contextValues || {};

    const [deletePending, startDeleteTransition] = useTransition();

    return <>
        {
            /* Render reorder handle */
            controls &&
            <div className={`
                grid transition-all duration-300 ease-in-out 
                ${reordering ? 'grid-cols-[1fr] opacity-100' : 'grid-cols-[0fr] opacity-0 mr-0 -ml-4'}
            `}>
                <div className="overflow-hidden flex items-center">
                    <button ref={handleRef} className="cursor-grab active:cursor-grabbing shrink-0" aria-label="Move item">
                        <BsGripVertical className="text-xl" />
                    </button>
                </div>
            </div>
        }
        <div className="flex flex-col grow self-center">
            <h3 className="font-semibold text-base">{item}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-200">{desc}</p>

            <div className="list-col-wrap text-gray-600 dark:text-gray-200 flex flex-col mt-2">
                {
                    links.length ?
                        links.map(link =>
                            <a href={link} target="_blank" key={link} className="w-fit hover:underline line-clamp-3 break-all">{link}</a>
                        ) :
                        noLinkProvidedText
                }
            </div>
        </div>
        {
            /* Render add/edit controls */
            controls &&
            <div className={`
                grid transition-all duration-300 ease-in-out min-w-fit
                ${!reordering ? 'grid-cols-[1fr] opacity-100 ml-2' : 'grid-cols-[0fr] opacity-0 ml-0'}
            `}>
                <div className={`flex items-center overflow-hidden`}>
                    <div className="flex flex-col sm:flex-row sm:gap-2 min-w-max">
                        <button className={`
                        btn btn-square btn-ghost
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        ${deletePending ? "cursor-not-allowed" : "cursor-pointer"}
                        ${deletePending ? "opacity-70" : ""}
                    `} aria-label="Edit item" disabled={deletePending} onClick={() => {
                        if (deletePending) return;

                        setActiveItem({ id, item, links: [...links, ""], desc });
                        setShow(true);
                    }}
                >
                    <BsPencilFill />
                </button>
                <button className={`
                        btn btn-square btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800
                        ${deletePending ? "cursor-not-allowed" : "cursor-pointer"}
                        ${deletePending ? "opacity-70" : ""}
                    `} disabled={deletePending} onClick={() => {
                        if (deletePending) return;

                        startDeleteTransition(async () => {
                            await deleteItem(id);
                        });
                    }}
                >
                    {deletePending ? <span className="loading loading-spinner"></span> : <BsTrashFill />}
                </button>
                    </div>
                </div>
            </div>
        }
        {
            /* Render claim controls */
            claimable && !controls &&
            <div className="flex flex-col sm:flex-row sm:gap-2">
                <ClaimControl itemId={id} claimData={claim_data} loggedInUser={loggedInUser} />
            </div>
        }
    </>;
}