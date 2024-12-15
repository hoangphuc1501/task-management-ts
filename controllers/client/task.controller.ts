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
    // phần trang
    let limitItem = 4;
    let page = 1;

    if(req.query.page) {
        page = parseInt(`${req.query.page}`);
    }
    if(req.query.limit) {
        limitItem = parseInt(`${req.query.limit}`);
    }
    const skip = (page - 1) * limitItem;
    // hết phần trang
    //tìm kiếm
    if(req.query.keyword){
        const regex = new RegExp(`${req.query.keyword}`, "i")
        find["title"] = regex
    }
    // hết tìm kiếm
    const tasks = await Task
    .find(find)
    .sort(sort)
    .skip(skip)
    .limit(limitItem);
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

export const changeMultiPatch = async (req: Request, res: Response) => {
    const status = req.body.status;
    const ids = req.body.id

    await Task.updateMany({
        _id: { $in: ids}
    },{
        status: status
    })
    res.json({
        Code: "success",
        message: "Thành công!"
    })
}

export const createPost = async (req: Request, res: Response) => {
    const data = req.body;

    const task = new Task(data);
    await task.save();

    res.json({
        code: "success",
        message: "Tạo mới công việc thành công",
        data: task
    })
}
export const editPatch = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;

    await Task.updateOne({
        _id: id
    }, data);

    res.json({
        code: "success",
        message: "cập nhật công việc thành công",
    })
}