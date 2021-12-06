import Command from "@Entities/commands";
import User from "@Entities/users";
import { Publisher } from "type-graphql";

interface CommandDeletorParams {
	commandIdToDelete: number;
	publish: Publisher<Command>;
	user: User;
}

export type CommandDeletor = (p: CommandDeletorParams) => Promise<Command>;

export const deleteCommand: CommandDeletor = async ({
	commandIdToDelete,
	publish,
	user,
}) => {
	const commandToDelete = await Command.findOne({ id: commandIdToDelete });

	if (!commandToDelete) {
		throw new Error("Command not found");
	}

	if (commandToDelete?.userId !== user.id && !user.isAdmin()) {
		throw new Error("You cannot delete not your message");
	}

	commandToDelete.deleted = true;
	await commandToDelete.save();

	await publish(commandToDelete);

	return commandToDelete;
};
