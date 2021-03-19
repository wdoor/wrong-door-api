import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer, PubSub } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import ChatResolver from "./resolvers/chat_resolver";
import CommandResolver from "./resolvers/commands_resolver";
import LogsResolver from "./resolvers/logs_resolver.";
import UserResolver from "./resolvers/user_resolver";

// TODO: Аутентификация
// TODO: Докер

const PORT = 7878;
const pubsub = new PubSub();

(async () => {
  const app = express();
  const schema = await buildSchema({
    resolvers: [ChatResolver, LogsResolver, CommandResolver, UserResolver],
  });

  await createConnection();

  const apolloServer = new ApolloServer({ schema });
  apolloServer.applyMiddleware({ app });

  const server = createServer(app);
  server.listen(PORT, () => {
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

    console.log(`
		express server STARTED
		on port ${PORT}
		url = http://localhost:${PORT}/graphql`);
  });
})();
