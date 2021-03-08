import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import ChatResolver from "./resolvers/chat_resolver";
import CommandResolver from "./resolvers/commands_resolver";
import OutputResolver from "./resolvers/output_resolver.";
import UserResolver from "./resolvers/user_resolver";

// TODO: Аутентификация
// TODO: Докер

(async () => {
    const app = express();

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ChatResolver, CommandResolver, OutputResolver, UserResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(7878, () => {
        console.log("express server started");
    });
})();
