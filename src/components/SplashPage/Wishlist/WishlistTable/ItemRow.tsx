import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import { WishlistContext } from "@/context/WishlistContext";
import { noLinkProvidedText, WishlistItem } from "@/lib/wishlist";
import { TableCell, TableRow } from "flowbite-react"
import { useContext } from "react";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";

export default function ItemRow({
    id,
    item,
    links,
    desc
}: WishlistItem) {
    const contextValues = useContext(WishlistContext);

    if (!contextValues)
        return <ErrorAlert errorCode="ERR_WSHLST_ITEMROW_CXT" />;

    const { setShow, setActiveItem, deleteItem } = contextValues;

    return <TableRow className="bg-white border-gray-300 dark:border-gray-700 dark:bg-gray-800 items-stretch">
        <TableCell>{item}</TableCell>
        <TableCell>
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
        <TableCell>
            {
                desc ?? ""
            }
        </TableCell>
        <TableCell className="pl-0 pr-3">
            <div className="flex flex-col gap-1">
                <span className="text-primary-600 dark:text-primary-400 hover:underline cursor-pointer flex items-center gap-2" onClick={() => {
                    setActiveItem({ id, item, links: [...links, ""], desc });
                    setShow(true);
                }}>
                    <BsPencilFill /> Edit
                </span>
                <span className="text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center gap-2" onClick={() => {
                    deleteItem(id);
                }}>
                    <BsTrashFill /> Delete
                </span>
            </div>
        </TableCell>
    </TableRow>;
}