import { createTheme } from "@mui/material";

const palette = { 
    dark1: "#1f2335", // Very dark blue-gray
    dark2: "#24283b", // Dark blue-gray
    dark3: "#292e42", // Medium dark blue-gray
    dark4: "#3b4261", // Soft dark blue
    dark5: "#414868", // Grayish blue
    dark6: "#545c7e", // Muted blue-gray
    dark7: "#565f89", // Slightly brighter blue-gray
    dark8: "#737aa2", // Dull lavender
    blue1: "#a9b1d6", // Pale blue-gray
    blue2: "#c0caf5", // Light blue-gray
    blue3: "#394b70", // Muted navy blue
    blue4: "#3d59a1", // Deep azure
    blue5: "#7aa2f7", // Bright azure
    blue6: "#7dcfff", // Sky blue
    blue7: "#b4f9f8", // Aqua blue
    purple1: "#bb9af7", // Soft lavender
    purple2: "#9d7cd8", // Muted violet
    orange1: "#ff9e64", // Light orange
    yellow1: "#ffc777", // Bright yellow
    green1: "#c3e88d", // Light green
    teal1: "#4fd6be", // Bright teal
    teal2: "#41a6b5", // Deep teal
    pink1: "#ff757f", // Light pink-red
    red1: "#c53b53", // Soft red
    magenta1: "#ff007c", // Bright magenta
};

export const tokyonight = createTheme({
    palette: {
        primary: {
            main: palette.blue3,
            contrastText: palette.teal1,
        },
        secondary:{
            main: palette.dark1,
            contrastText: palette.purple1,
        },
        error: {
            main: palette.pink1,
            contrastText: palette.dark1
        },
        warning: {
            main: palette.orange1,
            contrastText: palette.dark1
        },
        success: {
            main: palette.teal1,
            contrastText: palette.dark1
        },
        info: {
            main: palette.blue6,
            contrastText: palette.dark1
        },
        background:{
            default: palette.dark2,
        },
        text: {
            secondary: palette.blue1,
            primary: palette.blue2,
            disabled: palette.blue3,
        },
    },
})

export const globalColorTheme = {
    bookmarkItem: {
        tag: palette.orange1,
        title: palette.blue5,
        desc: palette.blue3,
        bg: palette.dark1,
        focusBg: palette.dark3,
    },
    suggestionWindow: {
        bg: palette.dark1,
        focusBg: palette.dark3,
        borderColor: "black",
        // match: "white",
        match: "rgb(200,230,255)",
        unmatch: palette.dark6,
    }
}