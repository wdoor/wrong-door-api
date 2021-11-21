import Command from "@Entities/commands";
import { FindConditions, MoreThan } from "typeorm";

interface CommandFinderOptions {
	fromId?: number;
	onlyExecuted?: boolean;
}

export type CommandsFinder = (
	options: CommandFinderOptions,
) => Promise<Command[]>;

export const findCommands: CommandsFinder = async ({
	fromId,
	onlyExecuted,
}) => {
	const find_params = {
		deleted: false,
		is_executed: onlyExecuted ?? undefined,
		fromId: fromId ? MoreThan(fromId) : undefined,
	} as FindConditions<Command>;

	const commands = await Command.find(find_params);

	return commands;
};
