import ChatMessage from "@Entities/chat";
import User from "@Entities/users";
import { Field, InputType, Int, Publisher } from "type-graphql";

@InputType()
export class ChatMessageInput {
	@Field(() => String)
	message: string;
}

interface ChatMessageCreatorParams {
	newMessage: ChatMessageInput;
	publish: Publisher<ChatMessage>;
	user: User;
}

export type ChatMessageCreator = (
	p: ChatMessageCreatorParams,
) => Promise<ChatMessage>;

export const addChatMessage: ChatMessageCreator = async ({
	publish,
	newMessage,
	user,
}) => {
	const createdMessage = await ChatMessage.create({
		...newMessage,
		userId: user.id,
		time: new Date(),
	}).save();

	await publish(createdMessage);

	return createdMessage;
};
