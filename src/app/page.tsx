import LoginMenu from "@/components/Login/LoginMenu";
import SplashPage from "@/components/SplashPage/SplashPage";
import { cookies } from "next/headers";

export default async function Home() {
    const user = (await cookies()).get("user")?.value;

    return (
        <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
            <main className="min-h-screen w-full max-w-3xl py-32 px-16 bg-white dark:bg-black sm:items-start">
                {
                    user ?
                    <SplashPage /> :
                    <LoginMenu />
                }
            </main>
        </div>
    );
}
