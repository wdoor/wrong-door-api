import Command from "@Entities/commands";
import { Publisher } from "type-graphql";

interface CommandDeletorParams {
	commandIdToDelete: number;
	publish: Publisher<Command>;
}

export type CommandDeletor = (p: CommandDeletorParams) => Promise<Command>;

export const deleteCommand: CommandDeletor = async ({
	commandIdToDelete,
	publish,
}) => {
	const commandToDelete = await Command.findOne({ id: commandIdToDelete });

	if (!commandToDelete) {
		throw new Error("Mesage not found");
	}

	commandToDelete.deleted = true;
	await commandToDelete.save();

	await publish(commandToDelete);

	return commandToDelete;
};
