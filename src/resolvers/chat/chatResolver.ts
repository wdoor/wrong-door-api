import {
	addChatMessage,
	ChatMessageInput,
} from "resolvers/chat/procedures/addMessage";
import { deleteChatMessage } from "resolvers/chat/procedures/deleteMessage";
import { findChatMessages } from "resolvers/chat/procedures/findMessages";
import {
	Arg,
	Authorized,
	Ctx,
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
import Context from "@Resolvers/context";

export enum ChatSubscription {
	Delete = "delete_chat_message",
	New = "new_chat_message",
}

@Resolver()
export class ChatResolver {
	@Authorized()
	@Query(() => [ChatMessage])
	Messages(
		@Arg("id", () => Int, { nullable: true }) id: number,
		@Ctx() { user }: Context,
	): Promise<ChatMessage[]> {
		return findChatMessages({ fromId: id, user });
	}

	@Authorized()
	@Mutation(() => ChatMessage)
	AddMessage(
		@Arg("message", () => ChatMessageInput, { nullable: false })
		newMessage: ChatMessage,
		@PubSub(ChatSubscription.New)
		publish: Publisher<ChatMessage>,
		@Ctx() { user }: Context,
	): Promise<ChatMessage> {
		return addChatMessage({ newMessage, publish, user });
	}

	@Authorized()
	@Mutation(() => ChatMessage)
	DeleteMessage(
		@Arg("id", () => Int, { nullable: false })
		messageIdToDelete: number,
		@PubSub(ChatSubscription.Delete)
		publish: Publisher<ChatMessage>,
		@Ctx() { user }: Context,
	): Promise<ChatMessage> {
		return deleteChatMessage({ publish, messageIdToDelete, user });
	}

	@Authorized()
	@Subscription(() => ChatMessage, { topics: ChatSubscription.New })
	async newMessage(@Root() message: ChatMessage): Promise<ChatMessage> {
		return message;
	}

	@Authorized()
	@Subscription(() => ChatMessage, { topics: ChatSubscription.Delete })
	async deletedMessage(@Root() message: ChatMessage): Promise<ChatMessage> {
		return message;
	}
}
