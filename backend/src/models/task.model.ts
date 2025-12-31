import mongoose, {Schema, Document, Types} from "mongoose";

export interface ITask extends Document {
    title: string;
    description?: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: Date;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            default: "TODO",
            enum: ["IN_PROGRESS", "TODO", "DONE"]
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },
        dueDate: {
            type: Date,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true
    }
    )

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;