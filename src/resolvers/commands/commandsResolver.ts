import {
	Arg,
	Authorized,
	Ctx,
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
import Context from "@Resolvers/context";
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
		@Ctx() { user }: Context,
		@Arg("id", () => Int, { nullable: true })
		id?: number,
		@Arg("execute_statement", () => Boolean, { nullable: true })
		executeStatement?: boolean,
	): Promise<Command[]> {
		return findCommands({ fromId: id, executionState: executeStatement, user });
	}

	@Authorized()
	@Mutation(() => Command)
	AddCommand(
		@Arg("command", () => CommandInput, { nullable: false })
		command: CommandInput,
		@PubSub(CommandsSubscription.New)
		publish: Publisher<Command>,
		@Ctx() { user }: Context,
	): Promise<Command> {
		return addCommand({ command, publish, user });
	}

	@Authorized()
	@Mutation(() => Command)
	DeleteCommand(
		@Arg("id", () => Int, { nullable: false })
		commandIdToDelete: number,
		@PubSub(CommandsSubscription.Delete)
		publish: Publisher<Command>,
		@Ctx() { user }: Context,
	): Promise<Command> {
		return deleteCommand({ commandIdToDelete, publish, user });
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
