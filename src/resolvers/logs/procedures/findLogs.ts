import LogsMessage from "@Entities/logs";
import { FindConditions, MoreThan } from "typeorm";

interface LogsFinderParams {
	fromId?: number;
}

export type LogsFinder = (p: LogsFinderParams) => Promise<LogsMessage[]>;

export const findLogsMessages: LogsFinder = async ({ fromId }) => {
	const find_params: FindConditions<LogsMessage> = {
		deleted: false,
		id: fromId ? MoreThan(fromId) : undefined,
	};

	const messages = await LogsMessage.find(find_params);

	return messages;
};
