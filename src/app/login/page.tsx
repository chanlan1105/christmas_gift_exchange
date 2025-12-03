import LoginOptions from "./LoginOptions";

const now = new Date();
const startOfYear = new Date(now.getFullYear(), 0, 0);
const diff = (Number(now) - now.getTimezoneOffset() * 60e3) - (Number(startOfYear) - startOfYear.getTimezoneOffset() * 60e3);

/** A numerical representation of the current day, from 1 to 365. */
const DAY = Math.floor(diff / (1000*60*60*24));

/** A numerical representation of the current month, from 1 to 12. */
const MONTH = now.getMonth() + 1;

/** The current year. */
const YEAR = now.getFullYear();

/** A numerical representation of Christmas Day */
const CHRISTMAS = 31 + (YEAR % 4 ? 28 : 29) + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30 + 25;

export default function LoginMenu() {
    return <>
        <h1 className="text-2xl font-bold mb-4">Christmas Gift Exchange</h1>
        {
            DAY > CHRISTMAS + 1 ?
                <p>Christmas {YEAR} has already passed. Check back next year!</p> :
            MONTH >= 11 ?
                <>
                    <p className="mb-3">Please select your name to log in (don't cheat, or that defeats the purpose!):</p>
                    <LoginOptions />
                </>:
                <p>Check back in November for details on Christmas {YEAR}.</p>
        }
    </>;
}