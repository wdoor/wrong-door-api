import express, { Application } from "express";
import { graphqlHTTP, OptionsData } from "express-graphql";
import SMRouter from "./SmartCollege/smart_college";
import TPCRouter from "./TpcolASU/tpcol";

const server: Application = express();

async function startup() {
    // Запускаем Smart College API
    server.use("/smartcollege-api", SMRouter);
    // Запускаем TpcolASU API
    const options: OptionsData = {
        schema: TPCRouter,
        graphiql: true,
    };
    server.use("/tpcol-api", graphqlHTTP(options));
}
startup();

server.listen(5000, () => console.log("server run"));
