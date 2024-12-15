
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import * as database from "./config/database"; // import tất cả các hàm
database.connect();
import { Task } from "./models/task.model";
// import {connect} from "./config/database"; import 1 số hàm cụ thể
// connect(); 
const app:Express = express();
const port: number = 3000;


app.get("/tasks" , async (req: Request, res: Response) => {
    const tasks = await Task.find({
        deleted: false
    })
    res.json(tasks);
});

app.get("/tasks/detail/:id" , async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false
    })
    res.json(task);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});