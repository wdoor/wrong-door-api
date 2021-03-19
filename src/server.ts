import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import ChatResolver from "./resolvers/chat_resolver";
import CommandResolver from "./resolvers/commands_resolver";
import LogsResolver from "./resolvers/logs_resolver.";
import UserResolver from "./resolvers/user_resolver";

// TODO: Аутентификация
// TODO: Докер

const PORT = 7878;

(async () => {
  const app = express();

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ChatResolver, LogsResolver, CommandResolver, UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`
        express server STARTED
        on port ${PORT}
        url = http://localhost:${PORT}/graphql
        `);
  });
})();
