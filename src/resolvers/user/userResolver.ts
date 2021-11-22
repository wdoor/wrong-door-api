import { addUser, UserInput } from "resolvers/user/procedures/createUser";
import { deleteUser } from "resolvers/user/procedures/deleteUser";
import { findUsers } from "resolvers/user/procedures/fundUsers";
import {
	updateUser,
	UserUpdateInput,
} from "resolvers/user/procedures/updateUser";
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
import User from "@Entities/users";

export enum UserSubscribtion {
	Delete = "delete_user",
	New = "new_user",
}

@Resolver()
export class UserResolver {
	@Query(() => [User])
	Users(): Promise<User[]> {
		return findUsers();
	}

	@Mutation(() => User)
	UpdateUser(
		@Arg("id", () => Int)
		id: number,
		@Arg("updated", () => UserUpdateInput)
		updated: UserUpdateInput,
	): Promise<User> {
		return updateUser({ updateFields: updated, userId: id });
	}

	@Mutation(() => User)
	CreateUser(
		@Arg("User", () => UserInput, { nullable: false })
		newUser: UserInput,
		@PubSub(UserSubscribtion.New)
		publish: Publisher<User>,
	): Promise<User> {
		return addUser({ publish, newUser });
	}

	@Mutation(() => User)
	DeleteUser(
		@Arg("id", () => Int, { nullable: false })
		id: number,
		@PubSub(UserSubscribtion.Delete)
		publish: Publisher<User>,
	): Promise<User> {
		return deleteUser({ publish, userId: id });
	}

	@Subscription(() => User, { topics: UserSubscribtion.New })
	async newUser(
		@Root()
		user: User,
	): Promise<User> {
		return user;
	}

	@Subscription(() => User, { topics: UserSubscribtion.Delete })
	async deletedUser(
		@Root()
		user: User,
	): Promise<User> {
		return user;
	}
}
