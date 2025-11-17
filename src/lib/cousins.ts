/** Array of cousin names, arranged in alphabetical order */
export const cousins = ["Ashley","Brendan","Daniel","Davis","Kalie","Lucas","Matt","Nathan","Tristan","Vanessa"] as const;

/** List of cousins who cannot gift to each other (siblings) */
export const exclusion: Cousin[][] = [
    ["Brendan", "Kalie"],
    ["Tristan", "Nathan"],
    ["Matt", "Daniel", "Vanessa"],
    ["Lucas", "Davis"]
];

/** Type represents the name of a cousin */
export type Cousin = typeof cousins[number];

export function isCousin(value: any): value is Cousin {
    return cousins.includes(value);
}