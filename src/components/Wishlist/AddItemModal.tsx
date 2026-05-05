"use client";

import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useContext, FormEvent, useCallback, useEffect, useState, useRef, useTransition } from "react";
import { WishlistContext } from "@/context/WishlistContext";

export default function AddItemModal() {
    const { show, setShow, activeItem } = useContext(WishlistContext)!;
    const [links, setLinks] = useState<string[]>([""]);
    const [submitting, startTransition] = useTransition();
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const setLink = useCallback((link: string, index: number) => {
        setLinks(prevLinks => {
            // Update state value of current link
            const newLinks = [...prevLinks];
            newLinks[index] = link;

            // If link array is full, ensure there is an empty box at the end
            if (newLinks[newLinks.length - 1] != "")
                newLinks.push("");

            return newLinks;
        });
    }, []);

    const deleteLink = useCallback((index: number) => {
        setLinks(prevLinks => {
            const newLinks = [...prevLinks];
            newLinks.splice(index, 1);
            return newLinks;
        });
    }, []);

    const closeModal = useCallback(() => {
        setShow(false);
    }, []);

    const submitForm = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            const formData = new FormData(e.currentTarget);

            if (activeItem && activeItem.id != null) {
                formData.set("id", activeItem.id.toString());
            }

            const res = await fetch("/api/wishlist/item", {
                method: activeItem && activeItem.id != null ? "PUT" : "POST",
                body: formData
            });

            if (res.ok) {
                startTransition(() => {
                    router.refresh();
                    closeModal();
                });
            }
            else
                alert("There was an issue adding the item to your wishlist. Please contact me. Error code: ERR_WSHLST_ADD. HTTP status: " + res.status);
        });
    }, [activeItem]);

    useEffect(() => {
        if (activeItem) {
            setLinks(activeItem.links);
        }
        else {
            setLinks([""]);
        }

        if (show) {
            formRef.current?.reset();
        }
    }, [show, activeItem]);

    return <dialog className={`modal ${show ? "modal-open" : ""}`}>
        <div className="modal-box font-sans max-w-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">{activeItem ? "Edit" : "Add"} an item {activeItem ? "on" : "to"} your wishlist</h3>
            <form ref={formRef} className="space-y-6" onSubmit={e => submitForm(e)} autoComplete="off">
                <div>
                    <div className="mb-2">
                        <Label htmlFor="wishlist-add-item">Item</Label>
                    </div>
                    <TextInput
                        id="wishlist-add-item"
                        name="item"
                        readOnly={submitting}
                        defaultValue={activeItem?.item ?? ""}
                        required
                    />
                </div>

                <div>
                    <div className="mb-2">
                        <Label>Link(s)</Label>
                    </div>

                    <div className="space-y-2">
                        {
                            links.map((link, index) =>
                                <TextInput
                                    key={index}
                                    value={link}
                                    onChange={e => setLink(e.target.value, index)}
                                    onBlur={e => {
                                        if (e.target.value == "" && index != links.length - 1)
                                            deleteLink(index);
                                    }}
                                    readOnly={submitting}
                                    name="links[]"
                                />
                            )
                        }
                    </div>
                </div>

                <div>
                    <div className="mb-2">
                        <Label htmlFor="wishlist-add-comment">Extra comment (optional)</Label>
                    </div>
                    <Textarea
                        id="wishlist-add-comment"
                        className="min-h-20"
                        name="desc"
                        defaultValue={activeItem?.desc ?? ""}
                        readOnly={submitting}
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="button" color="alternative" onClick={closeModal} disabled={submitting}>Cancel</Button>
                    <Button type="submit" color="green" disabled={submitting}>
                        {
                            activeItem ? "Update" : "Add"
                        }
                        {
                            submitting ? <Spinner size="sm" className="ml-2" /> : <></>
                        }
                    </Button>
                </div>
            </form>
        </div>
        <label className="modal-backdrop" onClick={closeModal} />
    </dialog>;
}