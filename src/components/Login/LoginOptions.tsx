'use client';

import PageContext from "@/context/PageContext";
import { Cousin, cousins, isCousin } from "@/lib/cousins";
import { Button, Select } from "flowbite-react";
import { useCallback, useContext, useState } from "react";
import { BsArrowRight } from "react-icons/bs";

export default function LoginOptions() {
    const [selected, setSelected] = useState<Cousin | null>(null);

    const contextValues = useContext(PageContext);
    if (!contextValues) return;
    const { setLoggedIn } = contextValues;

    const login = useCallback(() => {
        setLoggedIn(selected);
    }, [selected]);

    return <>
        <Select defaultValue="select_default" onChange={e => {
            if (!isCousin(e.target.value)) return;
            setSelected(e.target.value);
        }}>
            <option disabled value="select_default">Select&hellip;</option>
            {
                cousins.map(cousin =>
                    <option key={cousin} value={cousin}>{cousin}</option>
                )
            }
        </Select>

        {
            selected ?
            <Button className="mt-3" color="green" onClick={login}>
                Log in as {selected} <BsArrowRight className="ml-3" />
            </Button> :
            <></>
        }
    </>
}