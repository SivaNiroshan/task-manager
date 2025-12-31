import { Response } from "express";
import Task from "../models/task.model";
import { AuthRequest } from "../middleware/auth.middleware"

export const createTask = async (req: AuthRequest, res: Response) => {
    try{
        console.log("task creation request received")
        const { title, description, priority, dueDate } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }
        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            userId: req.userId
        })
        res.status(201).json(task);
        console.log("task created");
    } catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
}

export const getMyTasks = async (req: AuthRequest, res: Response) => {
    try {
        console.log("get tasks request received")
        const tasks = await Task.find({ userId: req.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        console.log("task update request received")
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to update task" });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        console.log("task deletion request received")
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};