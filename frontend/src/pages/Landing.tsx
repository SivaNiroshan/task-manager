import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TaskAlt } from "@mui/icons-material";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <Box
            minHeight="100vh"
            sx={{
                background: "linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 50%, #FDF2FF 100%)",
            }}
        >
            <Box
                component="header"
                sx={{
                    px: { xs: 2, sm: 4 },
                    py: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <TaskAlt color="primary" />
                    <Typography
                        variant="h4"
                        color="primary"
                        fontWeight={700}
                        sx={{ letterSpacing: "-0.02em" }}
                    >
                        TaskFlow
                    </Typography>
                </Stack>
            </Box>

            <Container
                maxWidth="md"
                sx={{
                    minHeight: "calc(100vh - 96px)",
                    display: "flex",
                    textAlign:"center",
                    alignItems: "center",
                    justifyContent: "center",
                    pb: 6,
                }}
            >
                <Stack spacing={3} maxWidth="md">
                    <Typography variant="h4" fontWeight="bold">
                        Organize your work. Stay on top of everything.
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary">
                        Capture tasks, track progress, and never miss a deadline
                        with a clean, focused task manager.
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        mt={1}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/register")}
                        >
                            Get started
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}