import { ApolloServer } from "apollo-server-express";
import express from "express";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import "reflect-metadata";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import Config from "./config/config";
import ChatResolver from "./resolvers/chat/chatResolver";
import CommandResolver from "./resolvers/commands/commandsResolver";
import LogsResolver from "./resolvers/logs/logsResolver.";
import UserResolver from "./resolvers/user/userResolver";

// TODO: Аутентификация
// TODO: Докер

(async () => {
	const app = express();
	const schema = await buildSchema({
		resolvers: [ChatResolver, LogsResolver, CommandResolver, UserResolver],
	});

	await createConnection();

	const apolloServer = new ApolloServer({ schema });
	await apolloServer.start();
	apolloServer.applyMiddleware({ app });

	const server = createServer(app);

	server.listen(Config.Port, () => {
		// eslint-disable-next-line no-new
		new SubscriptionServer({ execute, subscribe, schema }, { server });

		console.log(`
			express server STARTED
			on port ${Config.Port}
			url = http://localhost:${Config.Port}/graphql
		`);
	});
})();
