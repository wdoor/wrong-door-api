import LogsMessage from "@Entities/logs";
import { MoreThan } from "typeorm";
import combineFindParams from "utils/combineFindParams";

interface LogsFinderParams {
	fromId?: number;
}

export type LogsFinder = (p: LogsFinderParams) => Promise<LogsMessage[]>;

export const findLogsMessages: LogsFinder = async ({ fromId }) => {
	const find_params = combineFindParams<LogsMessage>({
		deleted: false,
		id: fromId ? MoreThan(fromId) : undefined,
	});

	const messages = await LogsMessage.find(find_params);

	return messages;
};
