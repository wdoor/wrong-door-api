import {
	addUser,
	Token,
	UserInput,
} from "resolvers/user/procedures/createUser";
import { deleteUser } from "resolvers/user/procedures/deleteUser";
import { findUsers } from "resolvers/user/procedures/findUsers";
import {
	updateUser,
	UserUpdateInput,
} from "resolvers/user/procedures/updateUser";
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
import User from "@Entities/users";
import Context from "@Resolvers/context";
import AccessLevel from "@Entities/access_level";
import { findUser } from "@Resolvers/user/procedures/findUser";

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
		@Ctx() { user }: Context,
	): Promise<User> {
		return updateUser({ updateFields: updated, userId: id, user });
	}

	@Authorized()
	@Query(() => User, { nullable: true })
	GetMyself(@Ctx() { user }: Context) {
		return findUser({ user });
	}

	@Mutation(() => Token)
	CreateUser(
		@Arg("User", () => UserInput, { nullable: false })
		newUser: UserInput,
		@PubSub(UserSubscription.New)
		publish: Publisher<User>,
	): Promise<Token> {
		return addUser({ publish, newUser });
	}

	@Authorized([AccessLevel.Admin])
	@Mutation(() => User)
	DeleteUser(
		@Arg("id", () => Int, { nullable: false })
		id: number,
		@PubSub(UserSubscription.Delete)
		publish: Publisher<User>,
		@Ctx() { user }: Context,
	): Promise<User> {
		return deleteUser({ publish, userId: id, user });
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
