import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { authMiddleware } from "auth/auth";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import Config from "@Config";
import express from "express";
import jwt from "express-jwt";
import {
	ChatResolver,
	CommandResolver,
	LogsResolver,
	UserResolver,
} from "@Resolvers/index";

// TODO: Аутентификация
// TODO: Докер

(async () => {
	await createConnection();

	const app = express();

	const schema = await buildSchema({
		resolvers: [ChatResolver, LogsResolver, CommandResolver, UserResolver],
		authChecker: authMiddleware,
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req }) => ({ req, user: req.user }),
	});

	app.use(
		"/graphql",
		jwt({
			secret: Config.SecretKey,
			algorithms: ["HS256"],
			credentialsRequired: false,
		}),
	);

	await apolloServer.start();

	apolloServer.applyMiddleware({ app });

	const server = createServer(app);

	server.listen(Config.Port, () => {
		// eslint-disable-next-line no-new
		new SubscriptionServer({ execute, subscribe, schema }, { server });

		// eslint-disable-next-line no-console
		console.log(`
			express server STARTED
			on port ${Config.Port}
			url = http://localhost:${Config.Port}/graphql
		`);
	});
})();
