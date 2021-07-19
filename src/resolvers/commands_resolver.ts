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

export enum CommandsSubscribtion {
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
		@Arg("id", () => Int, { nullable: true })
		id: number,
		@Arg("execute_statement", () => Boolean, { nullable: true })
		execute_statement: boolean
	): Promise<Command[]> {
		const find_params = { deleted: false } as FindConditions<Command>;

		if (id !== undefined) {
			find_params.id = MoreThan(id);
		}

		if (execute_statement !== undefined) {
			find_params.is_executed = execute_statement;
		}

		const commands = await Command.find(find_params);

		return commands;
	}

	@Mutation(() => Command)
	async AddCommand(
		@Arg("command", () => CommandInput, { nullable: false })
		command: CommandInput,
		@PubSub(CommandsSubscribtion.New)
		publish: Publisher<Command>
	): Promise<Command> {
		const created_command = await Command.create({
			time: new Date(),
			...command,
		}).save();

		await publish(created_command);

		return created_command;
	}

	@Mutation(() => Command)
	async DeleteCommand(
		@Arg("id", () => Int, { nullable: false })
		to_delete_id: number,
		@PubSub(CommandsSubscribtion.Delete)
		publish: Publisher<Command>
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
