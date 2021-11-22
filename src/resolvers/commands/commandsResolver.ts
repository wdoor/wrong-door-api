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
import Command from "@Entities/commands";
import { findCommands } from "./procedures/findCommands";
import { deleteCommand } from "./procedures/deleteCommand";
import { addCommand, CommandInput } from "./procedures/addCommand";

export enum CommandsSubscribtion {
	Delete = "delete_command",
	New = "new_command",
}

@Resolver()
export class CommandResolver {
	@Query(() => [Command])
	Commands(
		@Arg("id", () => Int, { nullable: true })
		id?: number,
		@Arg("execute_statement", () => Boolean, { nullable: true })
		executeStatement?: boolean,
	): Promise<Command[]> {
		return findCommands({ fromId: id, onlyExecuted: executeStatement });
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
		commandIdToDelete: number,
		@PubSub(CommandsSubscribtion.Delete)
		publish: Publisher<Command>,
	): Promise<Command> {
		return deleteCommand({ commandIdToDelete, publish });
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
