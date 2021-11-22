import ChatMessage from "@Entities/chat";
import { FindConditions, MoreThan } from "typeorm";

interface ChatMessageFinderProps {
	fromId: number;
	onlyDeleted?: boolean;
}

export type ChatMessageFinder = (
	p: ChatMessageFinderProps,
) => Promise<ChatMessage[]>;

export const findChatMessages: ChatMessageFinder = async ({
	fromId,
	onlyDeleted,
}) => {
	const findParams: FindConditions<ChatMessage> = {
		deleted: onlyDeleted,
		id: fromId ? MoreThan(fromId) : undefined,
	};

	const messages = await ChatMessage.find(findParams);

	return messages;
};
