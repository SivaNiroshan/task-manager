import { useState } from "react";
import api from "../api/axios";
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {type Task, type Priority, type Status, TODO, MEDIUM, DONE} from "../types/task";
import EditTaskForm from "./EditTaskForm";

interface TaskItemProps {
    task: Task;
    onChange: () => void;
}

export default function TaskItem({ task, onChange }: TaskItemProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const deleteTask = async () => {
        try {
            await api.delete(`/tasks/${task._id}`);
            onChange();
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    const priorityBgMap: Record<Priority, { bg: string; border: string }> = {
        LOW: {
            bg: "#ECFDF3",
            border: "#22C55E",
        },
        MEDIUM: {
            bg: "#FEF9C3",
            border: "#cd9b03",
        },
        HIGH: {
            bg: "#FEF2F2",
            border: "#EF4444",
        },
    };

    const effectiveStatus: Status = task.status || TODO;
    const effectivePriority: Priority = task.priority || MEDIUM;
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue =
        dueDate && effectiveStatus !== DONE
            ? dueDate.getTime() < Date.now()
            : false;

    const formatPriority = (p: Priority) =>
        p.charAt(0) + p.slice(1).toLowerCase();

    const formatStatus = (s: Status) =>
        s === "IN_PROGRESS" ? "IN PROGRESS" : s;

    return (
        <>
            <Card
                onClick={() => setEditOpen(true)}
                sx={{
                    backgroundColor: priorityBgMap[effectivePriority].bg,
                    borderColor: priorityBgMap[effectivePriority].border,
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderRadius: 3,
                    boxShadow: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    position: "relative",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                    },
                }}
            >
                <CardContent sx={{ height: "100%" }}>
                    <Stack
                        direction="column"
                        spacing={1.5}
                        sx={{ height: "100%", pr: 1.5, pb: 3.5 }}
                    >
                        <Stack spacing={1}>
                            <Typography variant="subtitle1" fontWeight={600} noWrap>
                                {task.title}
                            </Typography>

                            {task.description && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}
                                >
                                    {task.description}
                                </Typography>
                            )}

                            <Stack
                                direction="row"
                                spacing={1.5}
                                mt={0.5}
                                flexWrap="wrap"
                                alignItems="center"
                            >
                                <Typography variant="caption" color="text.secondary">
                                    {formatStatus(effectiveStatus)}
                                </Typography>

                                {task.priority && (
                                    <Typography variant="caption" color="text.secondary">
                                        {formatPriority(task.priority)}
                                    </Typography>
                                )}

                                {task.dueDate && (
                                    <Typography
                                        variant="caption"
                                        color={isOverdue ? "error" : "text.secondary"}
                                    >
                                        {isOverdue
                                            ? `Overdue · ${dueDate?.toLocaleDateString()}`
                                            : `Due · ${dueDate?.toLocaleDateString()}`}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>

                <div
                    style={{
                        position: "absolute",
                        right: 8,
                        bottom: 8,
                    }}
                >
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            setConfirmOpen(true);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </Card>

            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <EditTaskForm
                    task={task}
                    onClose={() => setEditOpen(false)}
                    onTaskUpdated={onChange}
                />
            </Dialog>

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Delete task</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Do you want to delete this task
                        {task.title ? `: "${task.title}"` : ""}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={async () => {
                            await deleteTask();
                            setConfirmOpen(false);
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}