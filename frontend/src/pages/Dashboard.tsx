import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AddTaskForm from "../components/AddTaskForm.tsx";
import TaskItem from "../components/TaskItem";
import { useAuth } from "../auth/AuthContext";
import {type Task, type Priority, type Status, TODO, IN_PROGRESS, DONE, LOW} from "../types/task";
import {
    AppBar,
    Box,
    Button,
    Container,
    Dialog,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    AddRounded,
    LogoutRounded,
    AssignmentTurnedInOutlined,
} from "@mui/icons-material";

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [open, setOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<"ALL" | Status>("ALL");
    const { logout } = useAuth();
    const navigate = useNavigate();

    const loadTasks = async () => {
        const res = await api.get<Task[]>("/tasks");
        setTasks(res.data);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleClose = () => setOpen(false);

    const priorityOrder: Record<Priority, number> = {
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
    };

    const filteredTasks =
        statusFilter === "ALL"
            ? tasks
            : tasks.filter((t) => (t.status || TODO) === statusFilter);

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const pA = priorityOrder[a.priority || LOW];
        const pB = priorityOrder[b.priority || LOW];

        if (pA !== pB) return pA - pB;

        if (a.dueDate && b.dueDate) {
            return (
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;

        return 0;
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const toggleFilter = (status: Status) => {
        setStatusFilter((prev) => (prev === status ? "ALL" : status));
    };

    const totalTasks = tasks.length;

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: "linear-gradient(90deg, #4F46E5, #6366F1)",
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <AssignmentTurnedInOutlined fontSize="small" />
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, letterSpacing: "-0.03em" }}
                        >
                            TaskFlow
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddRounded />}
                            onClick={() => setOpen(true)}
                        >
                            New Task
                        </Button>

                        <Button
                            color="inherit"
                            startIcon={<LogoutRounded />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    py: 4,
                    minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
                    background:
                        "linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 50%, #FDF2FF 100%)",
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={3}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            rowGap={2}
                        >
                            <Stack spacing={0.5}>
                                <Typography variant="h5" fontWeight={600}>
                                    My Tasks
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {totalTasks} task{totalTasks === 1 ? "" : "s"} total
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                                <Button
                                    variant={statusFilter === "ALL" ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => setStatusFilter("ALL")}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={statusFilter === TODO ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => toggleFilter(TODO)}
                                >
                                    Todo
                                </Button>
                                <Button
                                    variant={statusFilter === IN_PROGRESS ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => toggleFilter(IN_PROGRESS)}
                                >
                                    In Progress
                                </Button>
                                <Button
                                    variant={statusFilter === DONE ? "contained" : "outlined"}
                                    size="small"
                                    color="success"
                                    onClick={() => toggleFilter(DONE)}
                                >
                                    Done
                                </Button>
                            </Stack>
                        </Stack>

                        {tasks.length === 0 ? (
                            <Typography color="text.secondary" textAlign="center">
                                No tasks yet. Click “New Task” to get started.
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "repeat(4, minmax(0, 1fr))", // 4 per row on desktop
                                    },
                                }}
                            >
                                {sortedTasks.map((task) => (
                                    <Box key={task._id}>
                                        <TaskItem task={task} onChange={loadTasks} />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Stack>
                </Container>
            </Box>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <AddTaskForm
                    onTaskAdded={async () => {
                        await loadTasks();
                        handleClose();
                    }}
                />
            </Dialog>
        </>
    );
}