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
import ChatMessage from "../entity/chat";

@InputType()
class ChatMessageInput {
    @Field(() => String)
    message: string;

    @Field(() => String)
    username: string;
}

@Resolver()
export default class ChatResolver {
    @Query(() => [ChatMessage])
    async GetMessages(
        @Arg("id", () => Int, { nullable: true }) id: number,
    ) {
        let messages;
        if (id === undefined) {
            messages = await ChatMessage.find();
        } else {
            messages = await ChatMessage.find({ id: MoreThan(id) });
        }
        return (messages);
    }

    @Mutation(() => Boolean)
    async AddMessage(
        @Arg("message", () => ChatMessageInput, { nullable: false }) message: ChatMessage,
    ) {
        await ChatMessage.insert({
            message: message.message,
            username: message.username,
            time: new Date(),
        } as ChatMessage);
        return (true);
    }

    @Mutation(() => Boolean)
    async DeleteMessage(
        @Arg("id", () => Int, { nullable: false }) to_delete_id: number,
    ) {
        await ChatMessage.delete({ id: to_delete_id });
        return (true);
    }
}
