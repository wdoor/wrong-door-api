/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
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
    command: string;

    @Field(() => String)
    username: string;

    @Field(() => Int)
    type: number;
}

@Resolver()
export default class CommandResolver {
    @Query(() => [Command])
    async GetCommands(
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

    @Mutation(() => Boolean)
    async AddCommand(
        @Arg("command", () => CommandInput, { nullable: false }) command: CommandInput,
    ) {
        await Command.insert({
            command: command.command,
            username: command.username,
            type: command.type,
            time: new Date(),
        } as Command);
        return (true);
    }

    @Mutation(() => Boolean)
    async DeleteCommand(
        @Arg("id", () => Int, { nullable: false }) to_delete_id: number,
    ) {
        await Command.delete({ id: to_delete_id });
        return (true);
    }
}
