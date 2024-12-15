
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import * as database from "./config/database"; // import tất cả các hàm
database.connect();
import bodyParser from "body-parser";
import cors from "cors";
import { routeClient } from "./routes/client/index.route";
// import {connect} from "./config/database"; import 1 số hàm cụ thể
// connect(); 
const app:Express = express();
const port: number = 3000;

app.use(bodyParser.json());
app.use(cors());
// var corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 
// }
routeClient(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});