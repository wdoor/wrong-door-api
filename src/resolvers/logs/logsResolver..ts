import {
	Arg,
	Authorized,
	Ctx,
	Int,
	Mutation,
	Publisher,
	PubSub,
	Query,
	Resolver,
	Root,
	Subscription,
} from "type-graphql";
import LogsMessage from "@Entities/logs";
import { deleteLogsMessage } from "resolvers/logs/procedures/deleteLogs";
import Context from "@Resolvers/context";
import { addLogsMessage, LogsMessageInput } from "./procedures/addLogs";
import { findLogsMessages } from "./procedures/findLogs";

export enum LogsSubscription {
	Delete = "delete_log_message",
	New = "new_log_message",
}

@Resolver()
export class LogsResolver {
	@Authorized()
	@Query(() => [LogsMessage])
	Logs(
		@Arg("id", () => Int, { nullable: true })
		id: number,
		@Ctx() { user }: Context,
	): Promise<LogsMessage[]> {
		return findLogsMessages({ fromId: id, user });
	}

	@Authorized()
	@Mutation(() => LogsMessage)
	AddLog(
		@Arg("log", () => LogsMessageInput, { nullable: false })
		message: LogsMessageInput,
		@PubSub(LogsSubscription.New)
		publish: Publisher<LogsMessage>,
		@Ctx() { user }: Context,
	): Promise<LogsMessage> {
		return addLogsMessage({ message, publish, user });
	}

	@Authorized()
	@Mutation(() => LogsMessage)
	DeleteLog(
		@Arg("id", () => Int, { nullable: false })
		logId: number,
		@PubSub(LogsSubscription.Delete)
		publish: Publisher<LogsMessage>,
		@Ctx() { user }: Context,
	): Promise<LogsMessage> {
		return deleteLogsMessage({ publish, logId, user });
	}

	@Authorized()
	@Subscription(() => LogsMessage, { topics: LogsSubscription.New })
	async newLogMessage(
		@Root()
		log_message: LogsMessage,
	): Promise<LogsMessage> {
		return log_message;
	}

	@Authorized()
	@Subscription(() => LogsMessage, { topics: LogsSubscription.Delete })
	async deletedLogMessage(
		@Root()
		log_message: LogsMessage,
	): Promise<LogsMessage> {
		return log_message;
	}
}
