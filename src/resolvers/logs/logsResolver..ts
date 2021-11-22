import {
	Arg,
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
import { addLogsMessage, LogsMessageInput } from "./procedures/addLogs";
import { findLogsMessages } from "./procedures/findLogs";

export enum LogsSubscription {
	Delete = "delete_log_message",
	New = "new_log_message",
}

@Resolver()
export class LogsResolver {
	@Query(() => [LogsMessage])
	Logs(
		@Arg("id", () => Int, { nullable: true })
		id: number,
	): Promise<LogsMessage[]> {
		return findLogsMessages({ fromId: id });
	}

	@Mutation(() => LogsMessage)
	AddLog(
		@Arg("log", () => LogsMessageInput, { nullable: false })
		message: LogsMessageInput,
		@PubSub(LogsSubscription.New)
		publish: Publisher<LogsMessage>,
	): Promise<LogsMessage> {
		return addLogsMessage({ message, publish });
	}

	@Mutation(() => LogsMessage)
	DeleteLog(
		@Arg("id", () => Int, { nullable: false })
		logId: number,
		@PubSub(LogsSubscription.Delete)
		publish: Publisher<LogsMessage>,
	): Promise<LogsMessage> {
		return deleteLogsMessage({ publish, logId });
	}

	@Subscription(() => LogsMessage, { topics: LogsSubscription.New })
	async newLogMessage(
		@Root()
		log_message: LogsMessage,
	): Promise<LogsMessage> {
		return log_message;
	}

	@Subscription(() => LogsMessage, { topics: LogsSubscription.Delete })
	async deletedLogMessage(
		@Root()
		log_message: LogsMessage,
	): Promise<LogsMessage> {
		return log_message;
	}
}
