
// const Task = require("../../models/task.model");
import { Request, Response } from "express";
import { Task } from "../../models/task.model";

export const index = async (req: Request, res: Response) => {
    const find = {
        deleted: false,
    };
    // lọc theo trạng thái
    if (req.query.status) {
        find["status"] = req.query.status;
    }
    // hết lọc theo trạng thái
    // sắp xếp
    const sort = [];
    if(req.query.sortKey && req.query.SortValues){
        sort[`${req.query.sortKey}`] = req.query.SortValues
    }
    // hết sắp xếp
    const tasks = await Task
    .find(find)
    .sort(sort);
    res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false,
    });
    res.json(task);
};
