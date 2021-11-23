import LogsMessage from "@Entities/logs";
import { Publisher } from "type-graphql";

interface LogsDeletorParams {
	logId: number;
	publish: Publisher<LogsMessage>;
}

export type LogsDeletor = (p: LogsDeletorParams) => Promise<LogsMessage>;

export const deleteLogsMessage: LogsDeletor = async ({ logId, publish }) => {
	const logToDelete = await LogsMessage.findOne({ id: logId });

	if (!logToDelete) {
		throw new Error("Log Message not found");
	}

	logToDelete.deleted = true;
	await logToDelete.save();

	await publish(logToDelete);

	return logToDelete;
};
