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
  PubSub,
  Publisher,
} from "type-graphql";
import { MoreThan } from "typeorm";
import ChatMessage from "../entity/chat";

@InputType()
class ChatMessageInput {
  @Field(() => String)
  message: string;

  @Field(() => Int)
  userId: number;
}

@Resolver()
export default class ChatResolver {
  @Query(() => [ChatMessage])
  async Messages(@Arg("id", () => Int, { nullable: true }) id: number) {
    let messages;
    if (id === undefined) {
      messages = await ChatMessage.find();
    } else {
      messages = await ChatMessage.find({ id: MoreThan(id) });
    }
    return messages;
  }

  @Subscription(() => ChatMessage, {
    topics: "MESSAGES",
  })
  async newMessage(@Root() message: ChatMessage): Promise<ChatMessage> {
    return message;
  }

  @Mutation(() => ChatMessage)
  async AddMessage(
    @Arg("message", () => ChatMessageInput, { nullable: false })
    @PubSub("MESSAGES")
    publish: Publisher<ChatMessage>,
    message: ChatMessage
  ): Promise<ChatMessage> {
    const created_message = await ChatMessage.create({
      message: message.message,
      userId: message.userId,
      time: new Date(),
    } as ChatMessage).save();
    await publish(created_message);
    return created_message;
  }

  @Mutation(() => Boolean)
  async DeleteMessage(
    @Arg("id", () => Int, { nullable: false }) to_delete_id: number
  ) {
    await ChatMessage.delete({ id: to_delete_id });
    return true;
  }
}
