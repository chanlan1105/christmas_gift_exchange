'use client';

import LoginMenu from "@/components/Login/LoginMenu";
import SplashPage from "@/components/SplashPage/SplashPage";
import PageContext from "@/context/PageContext";
import { Cousin } from "@/lib/cousins";
import { useState } from "react";

export default function Home() {
    const [loggedIn, setLoggedIn] = useState<Cousin | null>(null);
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
            <main className="min-h-screen w-full max-w-3xl py-32 px-16 bg-white dark:bg-black sm:items-start">
                <PageContext value={{
                    loggedIn,
                    setLoggedIn
                }}>
                    {
                        loggedIn ?
                        <SplashPage /> :
                        <LoginMenu />
                    }
                </PageContext>
            </main>
        </div>
    );
}
