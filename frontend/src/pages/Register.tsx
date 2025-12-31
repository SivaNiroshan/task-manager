import api from "../api/axios";
import {
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import {
    Visibility,
    VisibilityOff,
    TaskAlt,
    PersonAddAlt1,
} from "@mui/icons-material";
import { useState } from "react";

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const registerSchema = yup.object({
        username: yup.string().required("Username is required"),
        email: yup
            .string()
            .email("Enter a valid email")
            .required("Email is required"),
        password: yup
            .string()
            .min(8, "Minimum 8 characters")
            .matches(/[a-z]/, "Must contain at least one lowercase")
            .matches(/[A-Z]/, "Must contain at least one uppercase")
            .matches(/\d/, "Must contain at least one number")
            .matches(
                /[@$!%*?&#]/,
                "Must contain at least one special character"
            )
            .required("Password is required"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Please confirm your password"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            try {
                await api.post("/auth/register", {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                });
                navigate("/login");
            } catch (error) {
                console.error(error);
            }
        },
    });

    return (
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
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={3}>
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
                                    Create your account
                                </Typography>
                                <Typography
                                    variant="body2"
                                    align="center"
                                    color="text.secondary"
                                >
                                    Sign up to start organizing your tasks today.
                                </Typography>
                            </Stack>

                            <TextField
                                name="username"
                                label="Username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.username &&
                                    Boolean(formik.errors.username)
                                }
                                helperText={
                                    formik.touched.username && formik.errors.username
                                }
                                fullWidth
                            />

                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.email &&
                                    Boolean(formik.errors.email)
                                }
                                helperText={
                                    formik.touched.email && formik.errors.email
                                }
                                fullWidth
                            />

                            <TextField
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.password &&
                                    Boolean(formik.errors.password)
                                }
                                helperText={
                                    formik.touched.password && formik.errors.password
                                }
                                fullWidth
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

                            <TextField
                                name="confirmPassword"
                                label="Confirm password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.confirmPassword &&
                                    Boolean(formik.errors.confirmPassword)
                                }
                                helperText={
                                    formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword
                                }
                                fullWidth
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() =>
                                                        setShowConfirmPassword((prev) => !prev)
                                                    }
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? (
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
                                type="submit"
                                variant="contained"
                                startIcon={<PersonAddAlt1 />}
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Creating account..." : "Sign up"}
                            </Button>

                            <Box textAlign="center">
                                <Typography variant="body2">
                                    Already have an account?{" "}
                                    <Button
                                        variant="text"
                                        color="primary"
                                        onClick={() => navigate("/login")}
                                    >
                                        Sign in
                                    </Button>
                                </Typography>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}