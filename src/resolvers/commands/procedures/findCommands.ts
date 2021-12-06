import Command from "@Entities/commands";
import User from "@Entities/users";
import { FindConditions, MoreThan } from "typeorm";
import combineFindParams from "utils/combineFindParams";

interface CommandFinderOptions {
	fromId?: number;
	executionState?: boolean;
	deletionState?: boolean;
	user: User;
}

export type CommandsFinder = (
	options: CommandFinderOptions,
) => Promise<Command[]>;

export const findCommands: CommandsFinder = async ({
	fromId,
	executionState,
	deletionState,
}) => {
	const findParams = combineFindParams<Command>({
		deleted: deletionState,
		is_executed: executionState,
		id: fromId ? MoreThan(fromId) : undefined,
	});

	const commands = await Command.find(findParams);

	return commands;
};
