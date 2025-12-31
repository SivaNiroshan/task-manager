import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Stack,
    Paper,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    IconButton,
    InputAdornment,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    TaskAlt,
    LoginRounded,
} from "@mui/icons-material";
import * as React from "react";

export default function Login() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorOpen, setErrorOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data.token);
            navigate("/home");
        } catch (error) {
            setErrorOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Box
                minHeight="100vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ background: "linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 50%, #FDF2FF 100%)", px: 2 }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={4}
                        sx={{ p: { xs: 3, md: 4 }, width: "100%" }}
                    >
                        <Stack
                            component="form"
                            spacing={3}
                            onSubmit={handleSubmit}
                        >
                            <Stack spacing={1} alignItems="center">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TaskAlt color="primary" fontSize="small" />
                                    <Typography
                                        variant="overline"
                                        color="primary"
                                        sx={{ letterSpacing: "0.12em" }}
                                    >
                                        TASKFLOW
                                    </Typography>
                                </Stack>

                                <Typography variant="h5" align="center">
                                    Sign in
                                </Typography>
                                <Typography
                                    variant="body2"
                                    align="center"
                                    color="text.secondary"
                                >
                                    Welcome back. Enter your details to access your tasks.
                                </Typography>
                            </Stack>

                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                required
                                fullWidth
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <TextField
                                label="Password"
                                required
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() =>
                                                        setShowPassword((prev) => !prev)
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<LoginRounded />}
                                disabled={submitting}
                            >
                                {submitting ? "Signing in..." : "Sign in"}
                            </Button>

                            <Box textAlign="center">
                                <Typography variant="body2">
                                    Don&apos;t have an account?{" "}
                                    <Button
                                        variant="text"
                                        color="primary"
                                        onClick={() => navigate("/register")}
                                    >
                                        Sign up
                                    </Button>
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Container>
            </Box>

            <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setErrorOpen(false)}
                    severity="error"
                    variant="filled"
                >
                    Invalid email or password
                </Alert>
            </Snackbar>
        </>
    );
}