"use client";

import { Alert } from "flowbite-react";
import { BsInfoCircleFill } from "react-icons/bs";
import { redirect, RedirectType } from "next/navigation";

export default function LogoutAlert() {
    return (
        <Alert color="info" rounded icon={BsInfoCircleFill} className="font-medium">
            Done browsing? <span className="font-medium cursor-pointer underline" onClick={() => {
                redirect("/login", RedirectType.push);
            }}>Click to return to the login page.</span>
        </Alert>
    );
}