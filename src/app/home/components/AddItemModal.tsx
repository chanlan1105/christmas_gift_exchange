"use client";

import { WishlistItem } from "@/lib/wishlist";
import { Button, Label, Modal, ModalBody, Spinner, Textarea, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState } from "react";

export default function AddItemModal({
    show, setShow, values=null
}: {
    show: boolean,
    setShow: Dispatch<SetStateAction<boolean>>,
    values?: WishlistItem | null
}) {
    const [links, setLinks] = useState<string[]>([""]);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

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
        setLinks([""]);
    }, []);

    const submitForm = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSubmitting(true);
        const formData = new FormData(e.currentTarget);

        if (values && values.id != null) {
            formData.set("id", values.id.toString());
        }

        const res = await fetch("/api/wishlist/item", {
            method: values && values.id != null ? "PUT" : "POST",
            body: formData
        });

        if (res.ok) {
            closeModal();
            router.refresh();
        }
        else 
            alert("There was an issue adding the item to your wishlist. Please contact me. Error code: ERR_WSHLST_ADD");

        setSubmitting(false);
    }, [values]);

    useEffect(() => {
        if (values) {
            setLinks(values.links);
        }
    }, [show, values]);

    return <Modal show={show} size="md" className="font-sans">
        <ModalBody>
            <h3 className="text-xl font-medium mb-4">{values ? "Edit" : "Add"} an item {values ? "on" : "to"} your wishlist</h3>
            <form className="space-y-6" onSubmit={e => submitForm(e)} autoComplete="off">
                <div>
                    <div className="mb-2">
                        <Label htmlFor="wishlist-add-item">Item</Label>
                    </div>
                    <TextInput
                        id="wishlist-add-item"
                        name="item"
                        readOnly={submitting}
                        defaultValue={values?.item}
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
                    <Textarea id="wishlist-add-comment" className="min-h-20" name="desc" defaultValue={values?.desc} readOnly={submitting} />
                </div>
                
                <div className="flex gap-2">
                    <Button type="button" color="alternative" onClick={closeModal} disabled={submitting}>Cancel</Button>
                    <Button type="submit" color="green" disabled={submitting}>
                        {
                            values ? "Update" : "Add"
                        } 
                        {
                            submitting ? <Spinner size="sm" className="ml-2" /> : <></>
                        }
                    </Button>
                </div>
            </form>
        </ModalBody>
    </Modal>;
}