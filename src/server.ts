import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import jwt from "express-jwt";
import ChatResolver from "./resolvers/chat_resolver";
import CommandResolver from "./resolvers/commands_resolver";
import LogsResolver from "./resolvers/logs_resolver.";
import UserResolver from "./resolvers/user_resolver";
import Config from "./config/config";
import { AuthMiddleware, ContextType, User } from "./authChecker";

// TODO: Аутентификация
// TODO: Докер

(async () => {
  await createConnection();

  const app = express();

  app.use(
    "/graphql",
    jwt({
      secret: "Aue",
      algorithms: ["HS256"],
    })
  );

  const schema = await buildSchema({
    resolvers: [ChatResolver, LogsResolver, CommandResolver, UserResolver],
    authChecker: AuthMiddleware,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }): ContextType => {
      const context: ContextType = { user: req.user as User };
      return context;
    },
  });
  apolloServer.applyMiddleware({ app });

  const server = createServer(app);
  server.listen(Config.Port, () => {
    // eslint-disable-next-line no-new
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server,
      }
    );

    // eslint-disable-next-line no-console
    console.log(`
			express server STARTED
			on port ${Config.Port}
			url = http://localhost:${Config.Port}/graphql
		`);
  });
})();
