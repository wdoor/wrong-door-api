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
    ) {
        let messages;
        if (id === undefined) {
            messages = await Command.find();
        } else {
            messages = await Command.find({ id: MoreThan(id) });
        }
        return (messages);
    }

    @Mutation(() => Command)
    async AddCommand(
        @Arg("command", () => CommandInput, { nullable: false }) command: CommandInput,
    ): Promise<Command> {
        const created_command = await Command.create({
            body: command.body,
            username: command.username,
            type: command.type,
            time: new Date(),
        } as Command).save();
        return (created_command);
    }

    @Mutation(() => Boolean)
    async DeleteCommand(
        @Arg("id", () => Int, { nullable: false }) to_delete_id: number,
    ) {
        await Command.delete({ id: to_delete_id });
        return (true);
    }
}
