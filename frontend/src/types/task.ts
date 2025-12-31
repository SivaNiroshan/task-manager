export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
    _id: string;
    title: string;
    description?: string;
    priority?: Priority;
    status?: Status;
    dueDate?: string;
}
export const TODO = "TODO" as const;
export const IN_PROGRESS = "IN_PROGRESS" as const;
export const DONE = "DONE" as const;
export const MEDIUM = "MEDIUM" as const;
export const LOW = "LOW" as const;