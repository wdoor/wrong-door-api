import express, { Application } from "express";
import SMRouter from "./SmartCollege/smart_college";
import TPCRouter from "./TpcolASU/tpcol";

const server: Application = express();

async function startup() {
    // Запускаем Smart College API
    server.use("/smartcollege-api", SMRouter);
    // Запускаем TpcolASU API
    server.use("/tpcol-api", TPCRouter);
}
startup();

server.listen(5000, () => console.log("server run"));
