import { Field, InputType, Int } from "type-graphql";
import Command from "@Entities/commands";

@InputType()
export class CommandInput {
	@Field(() => String)
	body: string;

	@Field(() => String)
	username: string;

	@Field(() => Int)
	type: number;
}

type CommandCreator = (command: CommandInput) => Promise<Command>;

export const addCommand: CommandCreator = async (command) => {
	const createdCommand = await Command.create({
		time: new Date(),
		...command,
	}).save();
	return createdCommand;
};
