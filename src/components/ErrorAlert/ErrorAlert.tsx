"use client";

import { Alert } from "flowbite-react";
import { BsExclamationDiamondFill } from "react-icons/bs";

export default function ErrorAlert({ errorCode }: { errorCode: string }) {
    return <Alert color="failure" icon={BsExclamationDiamondFill} rounded className="font-medium">
        There was an error loading this page. Please contact me. <br />
        Error code: {errorCode}
    </Alert>;
}