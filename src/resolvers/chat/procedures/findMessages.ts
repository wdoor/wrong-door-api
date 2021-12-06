import ChatMessage from "@Entities/chat";
import User from "@Entities/users";
import { MoreThan } from "typeorm";
import combineFindParams from "utils/combineFindParams";

interface ChatMessageFinderProps {
	fromId?: number;
	onlyDeleted?: boolean;
	user: User;
}

export type ChatMessageFinder = (
	p: ChatMessageFinderProps,
) => Promise<ChatMessage[]>;

export const findChatMessages: ChatMessageFinder = async ({
	fromId,
	onlyDeleted,
}) => {
	const findParams = combineFindParams<ChatMessage>({
		deleted: onlyDeleted,
		id: MoreThan(fromId ?? 0),
	});

	const messages = await ChatMessage.find(findParams);

	return messages;
};
