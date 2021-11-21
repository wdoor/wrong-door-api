import { deleteCommand } from "resolvers/commands/procedures/deleteCommand";
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
import Command from "../../entity/commands";
import CommandsSubscribtion from "./commandsSubscribtionTypes";
import { addCommand, CommandInput } from "./procedures/addCommand";

@Resolver()
export default class CommandResolver {
	@Query(() => [Command])
	Commands(
		@Arg("id", () => Int, { nullable: true })
		id?: number,
		@Arg("execute_statement", () => Boolean, { nullable: true })
		execute_statement?: boolean,
	): Promise<Command[]> {
		return findCommands({ fromId: id, onlyExecuted: execute_statement });
	}

	@Mutation(() => Command)
	AddCommand(
		@Arg("command", () => CommandInput, { nullable: false })
		command: CommandInput,
		@PubSub(CommandsSubscribtion.New)
		publish: Publisher<Command>,
	): Promise<Command> {
		return addCommand({ command, publish });
	}

	@Mutation(() => Command)
	DeleteCommand(
		@Arg("id", () => Int, { nullable: false })
		to_delete_id: number,
		@PubSub(CommandsSubscribtion.Delete)
		publish: Publisher<Command>,
	): Promise<Command> {
		return deleteCommand({ commandIdToDelete: to_delete_id, publish });
	}

	@Subscription(() => Command, { topics: CommandsSubscribtion.New })
	async newCommand(@Root() command: Command): Promise<Command> {
		return command;
	}

	@Subscription(() => Command, { topics: CommandsSubscribtion.Delete })
	async deletedCommand(@Root() command: Command): Promise<Command> {
		return command;
	}
}
