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
			messages = await ChatMessage.find({ deleted: false });
		} else {
			messages = await ChatMessage.find({ id: MoreThan(id), deleted: false });
		}
		return messages;
	}

	@Subscription(() => ChatMessage, {
		topics: "NewMessage",
	})
	async newMessage(@Root() message: ChatMessage): Promise<ChatMessage> {
		return message;
	}

	@Subscription(() => ChatMessage, {
		topics: "DeleteMessage",
	})
	async deletedMessage(@Root() message: ChatMessage): Promise<ChatMessage> {
		return message;
	}

	@Mutation(() => ChatMessage)
	async AddMessage(
		@Arg("message", () => ChatMessageInput, { nullable: false })
		message: ChatMessage,
		@PubSub("NewMessage")
		publish: Publisher<ChatMessage>
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
		@PubSub("DeleteMessage")
		publish: Publisher<ChatMessage>,
		@Arg("id", () => Int, { nullable: false }) to_delete_id: number
	): Promise<ChatMessage> {
		const message_to_delete = await ChatMessage.findOne({ id: to_delete_id });

		if (message_to_delete) {
			message_to_delete.deleted = true;
			await message_to_delete.save();
			publish(message_to_delete);
			return message_to_delete;
		}

		throw new Error("Mesage not found");
	}
}
