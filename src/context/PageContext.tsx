import { Cousin, cousins } from "@/lib/cousins";
import { createContext, Dispatch, SetStateAction } from "react";

type PageContextType = {
    loggedIn: Cousin | null,
    setLoggedIn: Dispatch<SetStateAction<Cousin | null>>
};

const PageContext = createContext<PageContextType | null>(null);

export default PageContext;