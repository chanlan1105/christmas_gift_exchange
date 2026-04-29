import { Cousin } from "./cousins";

export interface WishlistItem {
    id: number,
    item: string,
    links: string[],
    desc: string,
    claim_data?: {
        user: Cousin,
        comment?: string
    }[]
};

export const noLinkProvidedText = "None provided";