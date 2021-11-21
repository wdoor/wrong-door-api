import {
	Arg,
	Field,
	InputType,
	Int,
	Mutation,
	Publisher,
	PubSub,
	Query,
	Resolver,
	Root,
	Subscription,
} from "type-graphql";
import { FindConditions, MoreThan } from "typeorm";
import Command from "../../entity/commands";
import LogsMessage from "../../entity/logs";

export enum LogsSubscription {
	Delete = "delete_log_message",
	New = "new_log_message",
}

@InputType()
class LogsMessageInput {
	@Field(() => String)
	message: string;

	@Field(() => String)
	username: string;

	@Field(() => Int)
	commandId: number;
}

@Resolver()
export default class LogsResolver {
	@Query(() => [LogsMessage])
	async Logs(
		@Arg("id", () => Int, { nullable: true }) id: number,
	): Promise<LogsMessage[]> {
		const find_params: FindConditions<LogsMessage> = { deleted: false };

		if (id) find_params.id = MoreThan(id);

		const messages = await LogsMessage.find(find_params);

		return messages;
	}

	@Mutation(() => LogsMessage)
	async AddLog(
		@Arg("log", () => LogsMessageInput, { nullable: false })
		message: LogsMessageInput,
		@PubSub(LogsSubscription.New)
		publish: Publisher<LogsMessage>,
	): Promise<LogsMessage> {
		const new_log_message: Partial<LogsMessage> = {
			...message,
			time: new Date(),
		};

		try {
			const created_log = await LogsMessage.create(new_log_message).save();

			await Command.update(
				{ id: created_log.commandId },
				{ is_executed: true },
			);

			await publish(created_log);

			return created_log;
		} catch {
			throw new Error("There is no such command");
		}
	}

	@Mutation(() => LogsMessage)
	async DeleteLog(
		@Arg("id", () => Int, { nullable: false })
		to_delete_id: number,
		@PubSub(LogsSubscription.Delete)
		publish: Publisher<LogsMessage>,
	): Promise<LogsMessage> {
		const log_to_delete = await LogsMessage.findOne({ id: to_delete_id });

		if (log_to_delete) {
			await publish(log_to_delete);
			return log_to_delete;
		}

		throw new Error("Log Message not found");
	}

	@Subscription(() => LogsMessage, { topics: LogsSubscription.New })
	async newLogMessage(@Root() log_message: LogsMessage): Promise<LogsMessage> {
		return log_message;
	}

	@Subscription(() => LogsMessage, { topics: LogsSubscription.Delete })
	async deletedLogMessage(
		@Root() log_message: LogsMessage,
	): Promise<LogsMessage> {
		log_message.deleted = true;
		await log_message.save();
		return log_message;
	}
}
