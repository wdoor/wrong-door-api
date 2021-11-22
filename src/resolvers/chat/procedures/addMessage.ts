import ChatMessage from "@Entities/chat";
import { Field, InputType, Int, Publisher } from "type-graphql";

@InputType()
export class ChatMessageInput {
	@Field(() => String)
	message: string;

	@Field(() => Int)
	userId: number;
}

interface ChatMessageCreatorParams {
	newMessage: ChatMessageInput;
	publish: Publisher<ChatMessage>;
}

export type ChatMessageCreator = (
	p: ChatMessageCreatorParams,
) => Promise<ChatMessage>;

export const addChatMessage: ChatMessageCreator = async ({
	publish,
	newMessage,
}) => {
	const createdMessage = await ChatMessage.create({
		...newMessage,
		time: new Date(),
	}).save();

	await publish(createdMessage);

	return createdMessage;
};
