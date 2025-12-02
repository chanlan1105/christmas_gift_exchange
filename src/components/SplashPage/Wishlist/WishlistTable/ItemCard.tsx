import ErrorAlert from "@/components/ErrorAlert/ErrorAlert";
import { WishlistContext } from "@/context/WishlistContext";
import { WishlistItem } from "@/lib/wishlist";
import { tightCard } from "@/theme/tightCard";
import { Card } from "flowbite-react";
import { useContext } from "react";
import { BsChatLeftText, BsLink45Deg, BsPencilFill, BsTrashFill } from "react-icons/bs";

export default function ItemCard({
    id, item, links, desc
}: WishlistItem) {
    const contextValues = useContext(WishlistContext);

    if (!contextValues)
        return <ErrorAlert errorCode="ERR_WSHLST_ITEMROW_CXT" />;

    const { setShow, setActiveItem, deleteItem } = contextValues;

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
                <div className="flex flex-col">
                    {
                        links.map(link =>
                            <a href={link} target="_blank" key={link} className="w-min hover:underline">
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
        
        <div className="flex gap-4 text-sm">
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
    </Card>;
}