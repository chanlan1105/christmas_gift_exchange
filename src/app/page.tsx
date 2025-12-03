import { isCousin } from "@/lib/cousins";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = (await cookies()).get("user")?.value;

    if (user && isCousin(user))
        redirect("/home");
    else
        redirect("/login");
}
