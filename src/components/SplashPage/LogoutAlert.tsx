"use client";

import { Alert } from "flowbite-react";
import { BsExclamationTriangleFill } from "react-icons/bs";

export default function LogoutAlert({ loggedIn }: { loggedIn: string }) {
    const logout = () => {
        fetch("/api/logout", {
            method: "POST"
        }).then(res => {
            if (res.ok)
                window.location.reload();
            else
                alert("There was an error logging out. Please contact me. Error code: ERR_SPLASH_PG_LOGOUT");
        });
    };

    return <Alert color="warning" rounded icon={BsExclamationTriangleFill} className="font-medium">
        Not {loggedIn}? <span className="font-medium cursor-pointer underline" onClick={logout}>Click to switch users</span>
    </Alert>;
}