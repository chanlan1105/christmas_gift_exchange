"use client";

import { Button, ButtonGroup, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Cousin } from "@/lib/cousins";
import { BsChatLeftText, BsGift, BsPencilFill, BsX } from "react-icons/bs";
interface ClaimControlProps {
    itemId: number;
    claimData?: { user: Cousin; comment?: string }[];
    loggedInUser?: string;
}

/**
 * @TODO Maximum character length for comments
 */

export default function ClaimControl({ itemId, claimData, loggedInUser }: ClaimControlProps) {
    const [isClaiming, setIsClaiming] = useState(false);
    const [comment, setComment] = useState("");
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const isEditing = claimData?.some(({ user }) => user == loggedInUser);

    const handleClaim = () => {
        startTransition(async () => {
            const res = await fetch("/api/wishlist/claim", {
                method: isEditing ? "PUT" : "POST",
                body: JSON.stringify({ itemId, comment: comment || undefined }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                setIsClaiming(false);
                router.refresh();
            } else {
                alert("Failed to claim item. You might not be assigned to this person.");
            }
        });
    };

    return (
        <div className="flex flex-col gap-2 sm:min-w-[200px]">
            {claimData && claimData.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
                    {claimData.map((claim, i) => (
                        <div key={i} role="alert" className="alert dark:bg-gray-800">
                            <div>
                                <h3><strong>{claim.user}</strong> claimed this</h3>
                                {claim.comment && <div className="italic text-xs flex items-center gap-1"><BsChatLeftText /> {claim.comment}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isClaiming ? (
                <div className="flex flex-col gap-2">
                    <TextInput
                        sizing="sm"
                        placeholder="Optional comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        disabled={pending}
                    />
                    <div className="flex gap-2">
                        <Button size="xs" color="green" onClick={handleClaim} disabled={pending} className="flex-1 transition-colors">
                            {pending && <Spinner size="sm" light />}
                            Save
                        </Button>
                        <Button size="xs" color="gray" onClick={() => setIsClaiming(false)} disabled={pending} className="flex-1 transition-colors">Cancel</Button>
                    </div>
                </div>
            ) : claimData?.filter(({ user }) => user == loggedInUser).length ?
                <ButtonGroup className="shadow-none">
                    <Button className="flex-1 transition-colors" size="sm" onClick={() => {
                        const existingComment = claimData?.find(({ user }) => user == loggedInUser)?.comment;
                        setComment(existingComment || "");
                        setIsClaiming(true);
                    }} outline disabled={pending}>
                        <BsPencilFill className="mr-2" />
                        Edit
                    </Button>

                    <Button className="flex-1 whitespace-nowrap transition-colors" size="sm" color="gray" outline disabled={pending} onClick={() => {
                        startTransition(async () => {
                            const res = await fetch("/api/wishlist/claim", {
                                method: "DELETE",
                                body: JSON.stringify({ itemId }),
                                headers: { "Content-Type": "application/json" }
                            });
                            if (res.ok) {
                                router.refresh();
                            } else {
                                alert("Failed to remove claim.");
                            }
                        });
                    }}>
                        <BsX className="mr-2 h-6 w-6" />
                        Unclaim
                    </Button>
                </ButtonGroup>
                : <Button className="transition-colors" size="sm" onClick={() => setIsClaiming(true)} outline>
                    <BsGift className="mr-2" />
                    Claim Item
                </Button>
            }
        </div>
    );
}
