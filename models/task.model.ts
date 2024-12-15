import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: String,
        taskParentId: String,
        status: String,
        content: String,
        listUser: Array,
        timeStart: Date,
        timeFinish: Date,
        deleted: {
            type: Boolean,
            default: false,
        },
        createdBy: String,
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);
export const Task = mongoose.model("Task", taskSchema, "tasks");
