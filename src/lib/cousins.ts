/** Array of cousin names, arranged in alphabetical order */
export const cousins = ["Ashley","Brendan","Daniel","Davis","Kalie","Lucas","Matt","Nathan","Tristan","Vanessa"] as const;

/** List of cousins who cannot gift to each other (siblings) */
export const exclusion: Partial<Record<Cousin, Cousin[]>> = {
    "Brendan": ["Kalie"],
    "Kalie": ["Brendan"],
    "Tristan": ["Nathan"],
    "Nathan": ["Tristan"],
    "Matt": ["Daniel", "Vanessa"],
    "Daniel": ["Matt", "Vanessa"],
    "Vanessa": ["Matt", "Daniel"],
    "Lucas": ["Davis"],
    "Davis": ["Lucas"]
};

/** Type represents the name of a cousin */
export type Cousin = typeof cousins[number];

export function isCousin(value: any): value is Cousin {
    return cousins.includes(value);
}