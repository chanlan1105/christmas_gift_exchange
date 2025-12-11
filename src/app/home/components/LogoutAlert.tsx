"use client";

import { Alert } from "flowbite-react";
import { redirect } from "next/navigation";
import { BsExclamationTriangleFill } from "react-icons/bs";

export default function LogoutAlert({ loggedIn }: { loggedIn: string }) {
    const logout = () => {
        fetch("/api/auth/logout", {
            method: "POST"
        }).then(res => {
            if (res.ok)
                redirect("/login");
            else
                alert("There was an error logging out. Please contact me. Error code: ERR_SPLASH_PG_LOGOUT. HTTP status: " + res.status);
        });
    };

    return <Alert color="warning" rounded icon={BsExclamationTriangleFill} className="font-medium">
        Not {loggedIn}? <span className="font-medium cursor-pointer underline" onClick={logout}>Click to switch users</span>
    </Alert>;
}