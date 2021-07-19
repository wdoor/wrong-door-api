import {
	Arg,
	Field,
	InputType,
	Int,
	Mutation,
	Publisher,
	PubSub,
	Query,
	Resolver,
	Root,
	Subscription,
} from "type-graphql";
import { FindConditions, MoreThan } from "typeorm";
import ChatMessage from "../entity/chat";

@InputType()
class ChatMessageInput {
	@Field(() => String)
	message: string;

	@Field(() => Int)
	userId: number;
}
export enum ChatSubscribtion {
	Delete = "delete_chat_message",
	New = "new_chat_message",
}
@Resolver()
export default class ChatResolver {
	@Query(() => [ChatMessage])
	async Messages(
		@Arg("id", () => Int, { nullable: true }) id: number,
	): Promise<ChatMessage[]> {
		const find_params: FindConditions<ChatMessage> = { deleted: false };

		if (id) find_params.id = MoreThan(id);

		const messages = await ChatMessage.find(find_params);

		return messages;
	}

	@Mutation(() => ChatMessage)
	async AddMessage(
		@Arg("message", () => ChatMessageInput, { nullable: false })
		message: ChatMessage,
		@PubSub(ChatSubscribtion.New)
		publish: Publisher<ChatMessage>,
	): Promise<ChatMessage> {
		const created_message = await ChatMessage.create({
			...message,
			time: new Date(),
		}).save();
		await publish(created_message);
		return created_message;
	}

	@Mutation(() => ChatMessage)
	async DeleteMessage(
		@Arg("id", () => Int, { nullable: false })
		to_delete_id: number,
		@PubSub(ChatSubscribtion.Delete)
		publish: Publisher<ChatMessage>,
	): Promise<ChatMessage> {
		const message_to_delete = await ChatMessage.findOne({ id: to_delete_id });

		if (message_to_delete) {
			await publish(message_to_delete);
			return message_to_delete;
		}

		throw new Error("Mesage not found");
	}

	@Subscription(() => ChatMessage, { topics: ChatSubscribtion.New })
	async newMessage(@Root() message: ChatMessage): Promise<ChatMessage> {
		return message;
	}

	@Subscription(() => ChatMessage, { topics: ChatSubscribtion.Delete })
	async deletedMessage(@Root() message: ChatMessage): Promise<ChatMessage> {
		message.deleted = true;
		await message.save();
		return message;
	}
}
