import {
	Resolver,
	Arg,
	Query,
	Int,
	Mutation,
	InputType,
	Field,
	Subscription,
	Root,
	Publisher,
	PubSub,
} from "type-graphql";
import { FindConditions, MoreThan } from "typeorm";
import Command from "../entity/commands";

export enum CommandsSubscribtions {
	Delete = "delete_command",
	New = "new_command",
}

@InputType()
class CommandInput {
	@Field(() => String)
	body: string;

	@Field(() => String)
	username: string;

	@Field(() => Int)
	type: number;
}

@Resolver()
export default class CommandResolver {
	@Query(() => [Command])
	async Commands(
		@Arg("id", () => Int, { nullable: true }) id: number,
		@Arg("execute_statement", () => Boolean, { nullable: true })
		execute_statement: boolean
	): Promise<Command[]> {
		const findParams = {
			deleted: false,
			...(id !== undefined ? { id: MoreThan(id) } : {}),
			...(execute_statement !== undefined
				? { is_executed: execute_statement }
				: {}),
		} as FindConditions<Command>;

		const commands = await Command.find(findParams);

		return commands;
	}

	@Mutation(() => Command)
	async AddCommand(
		@Arg("command", () => CommandInput, { nullable: false })
		command: CommandInput,
		@PubSub(CommandsSubscribtions.New)
		publish: Publisher<Command>
	): Promise<Command> {
		const created_command = await Command.create({
			time: new Date(),
			...command,
		}).save();

		publish(created_command);

		return created_command;
	}

	@Mutation(() => Command)
	async DeleteCommand(
		@Arg("id", () => Int, { nullable: false }) to_delete_id: number,
		@PubSub(CommandsSubscribtions.Delete)
		publish: Publisher<Command>
	): Promise<Command> {
		const command_to_delete = await Command.findOne({ id: to_delete_id });

		if (command_to_delete) {
			command_to_delete.deleted = true;
			await command_to_delete.save();
			publish(command_to_delete);
			return command_to_delete;
		}

		throw new Error("Mesage not found");
	}

	@Subscription(() => Command, { topics: CommandsSubscribtions.New })
	async newCommand(@Root() message: Command): Promise<Command> {
		return message;
	}

	@Subscription(() => Command, { topics: CommandsSubscribtions.Delete })
	async deletedCommand(@Root() message: Command): Promise<Command> {
		return message;
	}
}
