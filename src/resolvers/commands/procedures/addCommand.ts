import { Field, InputType, Publisher } from "type-graphql";
import Command from "@Entities/commands";
import User from "@Entities/users";
import CommandType from "@Entities/command_types";

@InputType()
export class CommandInput {
	@Field(() => String)
	body: string;

	@Field(() => CommandType)
	type: CommandType;
}

interface CommandCreatorParams {
	command: CommandInput;
	publish: Publisher<Command>;
	user: User;
}

type CommandCreator = (p: CommandCreatorParams) => Promise<Command>;

export const addCommand: CommandCreator = async ({
	command,
	publish,
	user,
}) => {
	const createdCommand = await Command.create({
		time: new Date(),
		userId: user.id,
		...command,
	}).save();

	publish(createdCommand);

	return createdCommand;
};
