import ChatMessage from "@Entities/chat";
import User from "@Entities/users";
import { Publisher } from "type-graphql";

interface ChatMessageDeletorParams {
	messageIdToDelete: number;
	publish: Publisher<ChatMessage>;
	user: User;
}

export type ChatMessageDeletor = (
	p: ChatMessageDeletorParams,
) => Promise<ChatMessage>;

export const deleteChatMessage: ChatMessageDeletor = async ({
	messageIdToDelete,
	publish,
}) => {
	const messageToDelete = await ChatMessage.findOne({ id: messageIdToDelete });

	if (!messageToDelete) {
		throw new Error("Mesage not found");
	}

	messageToDelete.deleted = true;
	await messageToDelete.save();

	await publish(messageToDelete);

	return messageToDelete;
};
