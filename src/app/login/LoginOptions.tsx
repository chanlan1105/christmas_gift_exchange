'use client';

import { Cousin, cousins, isCousin } from "@/lib/cousins";
import { Button, HelperText, Select, TextInput } from "flowbite-react";
import { redirect } from "next/navigation";
import { FormEvent, useCallback, useState, useTransition } from "react";
import { BsArrowRight } from "react-icons/bs";

export default function LoginOptions() {
    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState<Cousin | null>(null);
    const [hasPassword, setHasPassword] = useState(false);
    const [validPassword, setValidPassword] = useState(true);

    const checkUserExists = useCallback(async (user: Cousin) => {
        const res = await fetch("/api/auth/check-user", {
            method: "POST",
            body: JSON.stringify({ user }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok)
            return alert("An error occured. Please contact me. Error code: ERR_LOGIN_CHECK_USR. HTTP status: " + res.status);

        // Server returns a boolean confirming if the user has already set a password
        const data = await res.json();

        setHasPassword(data);
    }, []);

    const login = useCallback(async (e: FormEvent<HTMLFormElement>, user: Cousin, hasPassword: boolean) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        let res: Response;

        if (hasPassword) {
            // Attempt to log in the user.
            const password = formData.get("password");

            res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    user,
                    password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok && (await res.text()) == "Invalid")
                return alert("Incorrect password. Please try again.");
            else if (!res.ok)
                return alert(`There was a problem logging you in. If this issue persists, please contact me. Error code: ERR_LOGIN. HTTP status: ${res.status}`);

            window.location.href = "/home";
        }
        else {
            // Set the user's password.
            const password = formData.get("password");
            const confirmPassword = formData.get("confirm-password");

            // Check that passwords match.
            if (password != confirmPassword)
                return setValidPassword(false);
            else
                setValidPassword(true);

            res = await fetch("/api/auth/set-pwd", {
                method: "POST",
                body: JSON.stringify({
                    user,
                    password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok)
                return alert(`There was an error logging you in. Please contact me. Error code: ERR_SETUP_PWD. HTTP status: ${res.status}. Extra details: ${await res.text()}`);
        }
        
        // Save the logged in username to localStorage and redirect to homepage
        localStorage.setItem("user", await res.text());
        redirect("/home");
    }, []);

    return <form onSubmit={e => {
        startTransition(async () => {
            await login(e, selected!, hasPassword);
        });
    }}>
        <Select defaultValue="" disabled={isPending} name="user" autoComplete="username" required onChange={e => {
            startTransition(async () => {
                if (!isCousin(e.target.value)) return;
                await checkUserExists(e.target.value);
                setSelected(e.target.value);
            });
        }}>
            <option disabled value="">Select&hellip;</option>
            {
                cousins.map(cousin =>
                    <option key={cousin} value={cousin}>{cousin}</option>
                )
            }
        </Select>

        {
            selected &&
            <>
                <p className="mb-2 mt-5">
                    { hasPassword ? "Enter your " : "Please choose a " }
                    password:
                </p>

                {
                    hasPassword ?
                    <TextInput type="password" name="password" autoComplete="current-password" disabled={isPending} required /> :
                    <>
                        <TextInput
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            disabled={isPending}
                            color={ validPassword ? undefined : "failure" } 
                            required
                        />
                        <p className="my-2">Confirm your password:</p>
                        <TextInput
                            type="password"
                            name="confirm-password" 
                            autoComplete="new-password" 
                            disabled={isPending} 
                            color={ validPassword ? undefined : "failure" } 
                            required
                        />
                        <HelperText
                            className={ validPassword ? "hidden" : undefined }
                        >
                            Passwords don't match.
                        </HelperText>
                    </>
                }

                <Button className="mt-5" color="green" type="submit" disabled={isPending}>
                    Log in as {selected} <BsArrowRight className="ml-3" />
                </Button>
            </>
        }
    </form>;
}