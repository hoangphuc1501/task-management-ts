"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.Task = mongoose_1.default.model("Task", taskSchema, "tasks");
