import {
	Resolver,
	Arg,
	Query,
	Int,
	Mutation,
	InputType,
	Field,
} from "type-graphql";
import { MoreThan } from "typeorm";
import Command from "../entity/commands";

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
	) {
		// TODO: 2:08, я это написал, что это, помогите...,
		// раздельно писать нельзя, тогда больше данных из бд будет брать....
		let messages: Command[];
		if (id !== undefined && execute_statement !== undefined) {
			messages = await Command.find({
				id: MoreThan(id),
				is_executed: execute_statement,
			});
		} else if (execute_statement !== undefined) {
			messages = await Command.find({ is_executed: execute_statement });
		} else if (id !== undefined) {
			messages = await Command.find({ id: MoreThan(id) });
		} else {
			messages = await Command.find();
		}
		return messages;
	}

	@Mutation(() => Command)
	async AddCommand(
		@Arg("command", () => CommandInput, { nullable: false })
		command: CommandInput
	): Promise<Command> {
		const created_command = await Command.create({
			body: command.body,
			username: command.username,
			type: command.type,
			time: new Date(),
		} as Command).save();
		return created_command;
	}

	@Mutation(() => Boolean)
	async DeleteCommand(
		@Arg("id", () => Int, { nullable: false }) to_delete_id: number
	) {
		await Command.delete({ id: to_delete_id });
		return true;
	}
}
