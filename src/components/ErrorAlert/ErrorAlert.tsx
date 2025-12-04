"use client";

import { Alert } from "flowbite-react";
import { BsExclamationDiamondFill } from "react-icons/bs";

export default function ErrorAlert({ errorCode, options }: { errorCode: string, options?: any }) {
    return <Alert color="failure" icon={BsExclamationDiamondFill} rounded className="font-medium mb-1">
        <div className="space-y-2"> 
            <p>
                There was an error loading this page. Please contact me. <br />
                Error code: {errorCode}
                {
                    options?.http &&
                    <><br />HTTP status: {options.http}</>
                }
            </p>
            {
                options?.console &&
                <p>
                    More error details available in the developer console.
                </p>
            }
        </div>
    </Alert>;
}