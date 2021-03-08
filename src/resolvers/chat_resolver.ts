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
    async Messages(
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

    @Mutation(() => ChatMessage)
    async AddMessage(
        @Arg("message", () => ChatMessageInput, { nullable: false }) message: ChatMessage,
    ): Promise<ChatMessage> {
        const created_message = await ChatMessage.create({
            message: message.message,
            username: message.username,
            time: new Date(),
        } as ChatMessage).save();
        return (created_message);
    }

    @Mutation(() => Boolean)
    async DeleteMessage(
        @Arg("id", () => Int, { nullable: false }) to_delete_id: number,
    ) {
        await ChatMessage.delete({ id: to_delete_id });
        return (true);
    }
}
