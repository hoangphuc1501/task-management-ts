
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import * as database from "./config/database"; // import tất cả các hàm
database.connect();
import bodyParser from "body-parser";
import { routeClient } from "./routes/client/index.route";
// import {connect} from "./config/database"; import 1 số hàm cụ thể
// connect(); 
const app:Express = express();
const port: number = 3000;

app.use(bodyParser.json());
routeClient(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});