import { createTheme } from "flowbite-react"

const theme = createTheme({
	button: {
        "base": "transition-colors transition-shadow select-none cursor-pointer"
    },
    table: {
        "root": {
            "wrapper": "min-w-min"
        }
    }
});

export default theme;