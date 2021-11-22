import Command from "@Entities/commands";
import { FindConditions, MoreThan } from "typeorm";

interface CommandFinderOptions {
	fromId?: number;
	onlyExecuted?: boolean;
	onlyDeleted?: boolean;
}

export type CommandsFinder = (
	options: CommandFinderOptions,
) => Promise<Command[]>;

export const findCommands: CommandsFinder = async ({
	fromId,
	onlyExecuted,
	onlyDeleted,
}) => {
	const findParams: FindConditions<Command> = {
		deleted: onlyDeleted,
		is_executed: onlyExecuted,
		id: fromId ? MoreThan(fromId) : undefined,
	};

	const commands = await Command.find(findParams);

	return commands;
};
