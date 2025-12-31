import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#6366F1", // brand purple
        },
        secondary: {
            main: "#10B981", // accent green
        },
        background: {
            default: "#F3F4F6", // page background
            paper: "#FFFFFF",   // cards / papers
        },
        text: {
            primary: "#111827",
            secondary: "#6B7280",
        },
    },
    typography: {
        fontFamily:
            "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        h3: {
            fontWeight: 700,
            letterSpacing: "-0.03em",
        },
        h5: {
            fontWeight: 600,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    paddingInline: 20,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                },
            },
        },
    },
});

export default theme;