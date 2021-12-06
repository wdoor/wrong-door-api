import Command from "@Entities/commands";
import LogsMessage from "@Entities/logs";
import User from "@Entities/users";
import { Field, InputType, Int, Publisher } from "type-graphql";

@InputType()
export class LogsMessageInput {
	@Field(() => String)
	message: string;

	@Field(() => Int)
	commandId: number;
}

interface LogCreatorParams {
	message: LogsMessageInput;
	publish: Publisher<LogsMessage>;
	user: User;
}

export type LogsCreator = (p: LogCreatorParams) => Promise<LogsMessage>;

export const addLogsMessage: LogsCreator = async ({
	message,
	publish,
	user,
}) => {
	const newLogMessage: Partial<LogsMessage> = {
		...message,
		userId: user.id,
		time: new Date(),
	};

	try {
		const createdLog = await LogsMessage.create(newLogMessage).save();

		await Command.update({ id: createdLog.commandId }, { is_executed: true });

		await publish(createdLog);

		return createdLog;
	} catch {
		throw new Error("There is no such command");
	}
};
