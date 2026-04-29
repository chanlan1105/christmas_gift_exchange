"use client";

import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import { WishlistContext } from "@/context/WishlistContext";
import { WishlistItem } from "@/lib/wishlist";
import { tightCard } from "@/theme/tightCard";
import { Card } from "flowbite-react";
import { useContext, useTransition } from "react";
import { BsChatLeftText, BsLink45Deg, BsPencilFill, BsTrashFill } from "react-icons/bs";
import ClaimControl from "./ClaimControl";

interface ItemCardProps {
    item: WishlistItem;
    controls?: boolean;
    claimable?: boolean;
    loggedInUser?: string;
}

export default function ItemCard({
    item: { id, item, links, desc, claim_data },
    controls = true,
    claimable = false,
    loggedInUser
}: ItemCardProps) {
    const contextValues = controls ? useContext(WishlistContext) : null;

    if (!contextValues && controls)
        return <ErrorAlert errorCode="ERR_WSHLST_ITEMROW_CXT" />;

    const { setShow = () => { }, setActiveItem = () => { }, deleteItem = () => { } } = contextValues || {};
    const [deletePending, startDeleteTransition] = useTransition();

    return <Card className="shadow-none" theme={tightCard.card}>
        <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {item}
        </h5>

        {
            links.length ?
                <div className="flex items-baseline gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        &#x200B;
                        <BsLink45Deg />
                    </div>
                    <div className="flex flex-col grow gap-2">
                        {
                            links.map(link =>
                                <a href={link} target="_blank" key={link} className="hover:underline w-full break-all line-clamp-3">
                                    {link}
                                </a>
                            )
                        }
                    </div>
                </div> :
                ""
        }

        {
            desc ?
                <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        &#x200B;
                        <BsChatLeftText />
                    </div>
                    <div className="flex flex-col">
                        {desc}
                    </div>
                </div> :
                ""
        }

        {
            controls &&
            <div className="flex gap-4 text-sm mt-3">
                <span className="text-primary-600 dark:text-primary-400 hover:underline cursor-pointer flex items-center gap-2" onClick={() => {
                    setActiveItem({ id, item, links: [...links, ""], desc });
                    setShow(true);
                }}>
                    <BsPencilFill /> Edit
                </span>
                <span className={`
                    text-red-600 dark:text-red-400
                    hover:underline
                    ${deletePending ? "cursor-not-allowed" : "cursor-pointer"}
                    flex items-center gap-2
                    ${deletePending ? "opacity-70" : ""}
                `} onClick={() => {
                        if (deletePending) return;

                        startDeleteTransition(async () => {
                            await deleteItem(id);
                        });
                    }}>
                    {!deletePending && <BsTrashFill />}
                    {deletePending ? <>Deleting&hellip;</> : "Delete"}
                </span>
            </div>
        }

        {
            claimable && !controls &&
            <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                <ClaimControl itemId={id} claimData={claim_data} loggedInUser={loggedInUser} />
            </div>
        }
    </Card>;
}