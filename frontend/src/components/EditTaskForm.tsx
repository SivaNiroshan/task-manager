import { useState } from "react";
import api from "../api/axios";
import {
    TextField,
    Button,
    Stack,
    MenuItem,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {MEDIUM, type Priority, type Status, type Task, TODO} from "../types/task.ts";

interface EditTaskFormProps {
    task: Task;
    onClose: () => void;
    onTaskUpdated: () => void;
}

export default function EditTaskForm({ task, onClose, onTaskUpdated }: EditTaskFormProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState<Priority>(task.priority || MEDIUM);
    const [status, setStatus] = useState<Status>(task.status || TODO);
    const [dueDate, setDueDate] = useState<Dayjs | null>(task.dueDate ? dayjs(task.dueDate) : null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || loading) return;

        setLoading(true);
        try {
            await api.put(`/tasks/${task._id}`, {
                title,
                description,
                priority,
                status,
                dueDate: dueDate ? dueDate.toISOString() : null
            });

            onTaskUpdated();
            onClose();

        } catch (err) {
            console.error("Failed to update task", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={submit}>
                <DialogTitle>Edit Task</DialogTitle>

                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                        />

                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <TextField
                            select
                            label="Priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            fullWidth
                        >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Status)}
                            fullWidth
                        >
                            <MenuItem value="TODO">Todo</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="DONE">Done</MenuItem>
                        </TextField>

                        <DatePicker
                            label="Due Date"
                            value={dueDate}
                            onChange={(newValue) => setDueDate(newValue)}
                            slotProps={{
                                textField: { fullWidth: true }
                            }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </LocalizationProvider>
    );
}
