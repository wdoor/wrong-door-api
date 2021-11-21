import { findCommands } from "resolvers/commands/procedures/findCommands";
import {
	Arg,
	Int,
	Mutation,
	Publisher,
	PubSub,
	Query,
	Resolver,
	Root,
	Subscription,
} from "type-graphql";
import { FindConditions, MoreThan } from "typeorm";
import Command from "../../entity/commands";
import CommandsSubscribtion from "./commandsSubscribtionTypes";
import { addCommand, CommandInput } from "./procedures/addCommand";

@Resolver()
export default class CommandResolver {
	@Query(() => [Command])
	async Commands(
		@Arg("id", () => Int, { nullable: true })
		id?: number,
		@Arg("execute_statement", () => Boolean, { nullable: true })
		execute_statement?: boolean,
	): Promise<Command[]> {
		const commands = await findCommands({
			fromId: id,
			onlyExecuted: execute_statement,
		});
		return commands;
	}

	@Mutation(() => Command)
	async AddCommand(
		@Arg("command", () => CommandInput, { nullable: false })
		command: CommandInput,
		@PubSub(CommandsSubscribtion.New)
		publish: Publisher<Command>,
	): Promise<Command> {
		const newCommand = await addCommand(command);

		await publish(newCommand);

		return newCommand;
	}

	@Mutation(() => Command)
	async DeleteCommand(
		@Arg("id", () => Int, { nullable: false })
		to_delete_id: number,
		@PubSub(CommandsSubscribtion.Delete)
		publish: Publisher<Command>,
	): Promise<Command> {
		const command_to_delete = await Command.findOne({ id: to_delete_id });

		if (command_to_delete) {
			await publish(command_to_delete);
			return command_to_delete;
		}

		throw new Error("Mesage not found");
	}

	@Subscription(() => Command, { topics: CommandsSubscribtion.New })
	async newCommand(@Root() command: Command): Promise<Command> {
		return command;
	}

	@Subscription(() => Command, { topics: CommandsSubscribtion.Delete })
	async deletedCommand(@Root() command: Command): Promise<Command> {
		command.deleted = true;
		await command.save();
		return command;
	}
}
