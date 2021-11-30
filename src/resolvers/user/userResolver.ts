import { addUser, UserInput } from "resolvers/user/procedures/createUser";
import { deleteUser } from "resolvers/user/procedures/deleteUser";
import { findUsers } from "resolvers/user/procedures/findUsers";
import {
	updateUser,
	UserUpdateInput,
} from "resolvers/user/procedures/updateUser";
import {
	Arg,
	Authorized,
	Int,
	Mutation,
	Publisher,
	PubSub,
	Query,
	Resolver,
	Root,
	Subscription,
} from "type-graphql";
import User from "@Entities/users";

export enum UserSubscription {
	Delete = "delete_user",
	New = "new_user",
}

@Resolver()
export class UserResolver {
	@Authorized()
	@Query(() => [User])
	Users(): Promise<User[]> {
		return findUsers();
	}

	@Authorized()
	@Mutation(() => User)
	UpdateUser(
		@Arg("id", () => Int)
		id: number,
		@Arg("updated", () => UserUpdateInput)
		updated: UserUpdateInput,
	): Promise<User> {
		return updateUser({ updateFields: updated, userId: id });
	}

	@Authorized()
	@Mutation(() => User)
	CreateUser(
		@Arg("User", () => UserInput, { nullable: false })
		newUser: UserInput,
		@PubSub(UserSubscription.New)
		publish: Publisher<User>,
	): Promise<User> {
		return addUser({ publish, newUser });
	}

	@Authorized()
	@Mutation(() => User)
	DeleteUser(
		@Arg("id", () => Int, { nullable: false })
		id: number,
		@PubSub(UserSubscription.Delete)
		publish: Publisher<User>,
	): Promise<User> {
		return deleteUser({ publish, userId: id });
	}

	@Authorized()
	@Subscription(() => User, { topics: UserSubscription.New })
	async newUser(
		@Root()
		user: User,
	): Promise<User> {
		return user;
	}

	@Authorized()
	@Subscription(() => User, { topics: UserSubscription.Delete })
	async deletedUser(
		@Root()
		user: User,
	): Promise<User> {
		return user;
	}
}
