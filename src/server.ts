import express, { Application } from "express";
import { graphqlHTTP, OptionsData } from "express-graphql";
import SMRouter from "./smart_college";

const server: Application = express();

async function startup() {
    // Запускаем Smart College API
    server.use("/smartcollege-api", SMRouter);
}
startup();

server.listen(5000, () => console.log("server run"));
