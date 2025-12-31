import { useState } from "react";
import api from "../api/axios";
import {Button, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField} from "@mui/material";
import type {Dayjs} from "dayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {MEDIUM, type Priority} from "../types/task.ts";

interface TaskFormProps {
    onTaskAdded: () => Promise<void> | void;
}

export default function AddTaskForm({ onTaskAdded }: TaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>(MEDIUM);
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try{
            await api.post("/tasks", {
                title,
                description,
                priority,
                dueDate: dueDate ? dueDate.toISOString() : null
            });
            setTitle("");
            setDescription("");
            setPriority(MEDIUM);
            setDueDate(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            await onTaskAdded()
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={submit}>
                <DialogTitle>Add New Task</DialogTitle>
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
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Task"}
                    </Button>
                </DialogActions>
            </form>
        </LocalizationProvider>
    );
}
