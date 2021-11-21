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
import { deleteLogs } from "resolvers/logs/procedures/deleteLogs";
import { createLogs, LogsMessageInput } from "./procedures/addLogs";
import { findLogs } from "./procedures/findLogs";

export enum LogsSubscription {
	Delete = "delete_log_message",
	New = "new_log_message",
}

@Resolver()
export default class LogsResolver {
	@Query(() => [LogsMessage])
	Logs(
		@Arg("id", () => Int, { nullable: true })
		id: number,
	): Promise<LogsMessage[]> {
		return findLogs({ fromId: id });
	}

	@Mutation(() => LogsMessage)
	AddLog(
		@Arg("log", () => LogsMessageInput, { nullable: false })
		message: LogsMessageInput,
		@PubSub(LogsSubscription.New)
		publish: Publisher<LogsMessage>,
	): Promise<LogsMessage> {
		return createLogs({ message, publish });
	}

	@Mutation(() => LogsMessage)
	DeleteLog(
		@Arg("id", () => Int, { nullable: false })
		to_delete_id: number,
		@PubSub(LogsSubscription.Delete)
		publish: Publisher<LogsMessage>,
	): Promise<LogsMessage> {
		return deleteLogs({ publish, logId: to_delete_id });
	}

	@Subscription(() => LogsMessage, { topics: LogsSubscription.New })
	async newLogMessage(@Root() log_message: LogsMessage): Promise<LogsMessage> {
		return log_message;
	}

	@Subscription(() => LogsMessage, { topics: LogsSubscription.Delete })
	async deletedLogMessage(
		@Root() log_message: LogsMessage,
	): Promise<LogsMessage> {
		return log_message;
	}
}
