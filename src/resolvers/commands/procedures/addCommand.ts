import { Field, InputType, Int, Publisher } from "type-graphql";
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

interface CommandCreatorParams {
	command: CommandInput;
	publish: Publisher<Command>;
}

type CommandCreator = (p: CommandCreatorParams) => Promise<Command>;

export const addCommand: CommandCreator = async ({ command, publish }) => {
	const createdCommand = await Command.create({
		time: new Date(),
		...command,
	}).save();

	publish(createdCommand);

	return createdCommand;
};
