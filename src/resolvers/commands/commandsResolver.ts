import {
	Arg,
	Authorized,
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

export enum CommandsSubscription {
	Delete = "delete_command",
	New = "new_command",
}

@Resolver()
export class CommandResolver {
	@Authorized()
	@Query(() => [Command])
	Commands(
		@Arg("id", () => Int, { nullable: true })
		id?: number,
		@Arg("execute_statement", () => Boolean, { nullable: true })
		executeStatement?: boolean,
	): Promise<Command[]> {
		return findCommands({ fromId: id, executionState: executeStatement });
	}

	@Authorized()
	@Mutation(() => Command)
	AddCommand(
		@Arg("command", () => CommandInput, { nullable: false })
		command: CommandInput,
		@PubSub(CommandsSubscription.New)
		publish: Publisher<Command>,
	): Promise<Command> {
		return addCommand({ command, publish });
	}

	@Authorized()
	@Mutation(() => Command)
	DeleteCommand(
		@Arg("id", () => Int, { nullable: false })
		commandIdToDelete: number,
		@PubSub(CommandsSubscription.Delete)
		publish: Publisher<Command>,
	): Promise<Command> {
		return deleteCommand({ commandIdToDelete, publish });
	}

	@Authorized()
	@Subscription(() => Command, { topics: CommandsSubscription.New })
	async newCommand(@Root() command: Command): Promise<Command> {
		return command;
	}

	@Authorized()
	@Subscription(() => Command, { topics: CommandsSubscription.Delete })
	async deletedCommand(@Root() command: Command): Promise<Command> {
		return command;
	}
}
