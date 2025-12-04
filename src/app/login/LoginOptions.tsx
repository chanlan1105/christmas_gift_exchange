'use client';

import { Cousin, cousins, isCousin } from "@/lib/cousins";
import { Button, Select } from "flowbite-react";
import { useCallback, useState } from "react";
import { BsArrowRight } from "react-icons/bs";

export default function LoginOptions() {
    const [selected, setSelected] = useState<Cousin | null>(null);

    const login = useCallback(() => {
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ name: selected }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok)
                window.location.href = "/home";
            else
                alert("There was an error logging you in. Please contact me. Error code: ERR_LOGIN. HTTP status: " + res.status);
        });
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