import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;
}
const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
    },
    {
        timestamps: true,
    }
    )

const User = mongoose.model<IUser>("User", UserSchema);
export default User;