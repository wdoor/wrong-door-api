import {
	addChatMessage,
	ChatMessageInput,
} from "resolvers/chat/procedures/addMessage";
import { deleteChatMessage } from "resolvers/chat/procedures/deleteMessage";
import { findChatMessages } from "resolvers/chat/procedures/findMessages";
import {
	Arg,
	Int,
	Mutation,
	Publisher,
	PubSub,
	Query,
	Resolver,
	Root,
	Subscription,
} from "type-graphql";
import ChatMessage from "@Entities/chat";

export enum ChatSubscribtion {
	Delete = "delete_chat_message",
	New = "new_chat_message",
}

@Resolver()
export class ChatResolver {
	@Query(() => [ChatMessage])
	Messages(
		@Arg("id", () => Int, { nullable: true }) id: number,
	): Promise<ChatMessage[]> {
		return findChatMessages({ fromId: id });
	}

	@Mutation(() => ChatMessage)
	AddMessage(
		@Arg("message", () => ChatMessageInput, { nullable: false })
		newMessage: ChatMessage,
		@PubSub(ChatSubscribtion.New)
		publish: Publisher<ChatMessage>,
	): Promise<ChatMessage> {
		return addChatMessage({ newMessage, publish });
	}

	@Mutation(() => ChatMessage)
	DeleteMessage(
		@Arg("id", () => Int, { nullable: false })
		messageIdToDelete: number,
		@PubSub(ChatSubscribtion.Delete)
		publish: Publisher<ChatMessage>,
	): Promise<ChatMessage> {
		return deleteChatMessage({ publish, messageIdToDelete });
	}

	@Subscription(() => ChatMessage, { topics: ChatSubscribtion.New })
	async newMessage(@Root() message: ChatMessage): Promise<ChatMessage> {
		return message;
	}

	@Subscription(() => ChatMessage, { topics: ChatSubscribtion.Delete })
	async deletedMessage(@Root() message: ChatMessage): Promise<ChatMessage> {
		return message;
	}
}
