"use client";

import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import { WishlistContext } from "@/context/WishlistContext";
import { noLinkProvidedText, WishlistItem } from "@/lib/wishlist";
import { TableCell, TableRow } from "flowbite-react"
import { useContext, useTransition } from "react";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";

interface ItemRowDetails {
    item: WishlistItem,
    controls: boolean
};

/**
 * Renders a table row displaying a wishlist item with its details.
 * 
 * @component
 * @param props - The component props
 * @param props.item - The item object
 * @param props.item.id - The unique identifier of the item
 * @param props.item.item - The name of the item
 * @param props.item.links - Array of URLs associated with the item
 * @param props.item.desc - Description of the item
 * @param [props.controls] - Whether to display edit and delete controls
 * 
 * @returns A TableRow component containing item details and optional control buttons
 * 
 * @throws Renders an ErrorAlert if context is required but unavailable
 * 
 * @example
 * <ItemRow 
 *   item={{ id: "1", item: "Book", links: ["https://example.com"], desc: "A great book" }} 
 *   controls={true} 
 * />
 */
export default function ItemRow({
    item: { id, item, links, desc },
    controls
}: ItemRowDetails) {
    // Fetch context values, if needed, for edit and delete controls
    const contextValues = controls ? useContext(WishlistContext) : null;

    if (!contextValues && controls)
        return <ErrorAlert errorCode="ERR_WSHLST_ITEMROW_CXT" />;

    const { 
        setShow = () => {},
        setActiveItem = () => {},
        deleteItem = () => {}
    } = contextValues || {};

    const [deletePending, startDeleteTransition] = useTransition();

    return <TableRow className="bg-white border-gray-300 dark:border-gray-700 dark:bg-gray-800 items-stretch">
        <TableCell>{item}</TableCell>
        <TableCell>
            { /* Render links */ }
            <div className="flex flex-col gap-1 h-full">
                {
                    links.length ?
                    links.map(link =>
                        <a href={link} target="_blank" key={link} className="w-min hover:underline">{link}</a>
                    ) :
                    noLinkProvidedText
                }
            </div>
        </TableCell>
        <TableCell style={{ minWidth: "30ch" }}>
            { /* Render description, if present */ }
            {
                desc ?? ""
            }
        </TableCell>

        {
            /* Render add/edit controls */
            controls &&
            <TableCell className="pl-0 pr-3">
                <div className="flex flex-col gap-1">
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
                        { !deletePending && <BsTrashFill /> }
                        { deletePending ? <>Deleting&hellip;</> : "Delete" }
                    </span>
                </div>
            </TableCell>
        }
        
    </TableRow>;
}