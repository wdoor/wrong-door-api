import LogsMessage from "@Entities/logs";
import User from "@Entities/users";
import { Publisher } from "type-graphql";

interface LogsDeletorParams {
	logId: number;
	publish: Publisher<LogsMessage>;
	user: User;
}

export type LogsDeletor = (p: LogsDeletorParams) => Promise<LogsMessage>;

export const deleteLogsMessage: LogsDeletor = async ({
	logId,
	publish,
	user,
}) => {
	const logToDelete = await LogsMessage.findOne({ id: logId });

	if (!logToDelete) {
		throw new Error("Log Message not found");
	}

	if (!user.isAdmin()) {
		throw new Error("You are not an admin");
	}

	logToDelete.deleted = true;
	await logToDelete.save();

	await publish(logToDelete);

	return logToDelete;
};
