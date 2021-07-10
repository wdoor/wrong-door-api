import {
	Resolver,
	Arg,
	Query,
	Int,
	Mutation,
	InputType,
	Field,
	Subscription,
	Root,
	PubSub,
	Publisher,
} from "type-graphql";
import User from "../entity/users";

export enum UserSubscribtion {
	Delete = "delete_user",
	New = "new_user",
}

@InputType()
class UserInput {
	@Field(() => String)
	deviceid: string;

	@Field(() => String)
	username: string;
}

@InputType()
class UserUpdateInput {
	@Field(() => String, { nullable: true })
	username?: string;

	@Field(() => Int, { nullable: true })
	access_level?: number;

	@Field(() => String, { nullable: true })
	image?: string;
}

@Resolver()
export default class UserResolver {
	@Query(() => [User])
	async Users(): Promise<User[]> {
		const users = await User.find({ deleted: false });
		return users;
	}

	@Mutation(() => User)
	async UpdateUser(
		@Arg("id", () => Int) id: number,
		@Arg("updated", () => UserUpdateInput) updated: UserUpdateInput
	): Promise<User> {
		await User.update({ id }, updated);
		const updated_user = await User.findOneOrFail(id);
		return updated_user;
	}

	@Mutation(() => User)
	async CreateUser(
		@Arg("User", () => UserInput, { nullable: false })
		new_user: UserInput,
		@PubSub(UserSubscribtion.New)
		publish: Publisher<User>
	): Promise<User> {
		const created_user: User = await User.create(new_user).save();
		await publish(created_user);
		return created_user;
	}

	@Mutation(() => User)
	async DeleteUser(
		@Arg("id", () => Int, { nullable: false })
		id: number,
		@PubSub(UserSubscribtion.Delete)
		publish: Publisher<User>
	): Promise<User> {
		const user_to_delete = await User.findOne({ id });

		if (user_to_delete) {
			await publish(user_to_delete);
			return user_to_delete;
		}

		throw new Error("User not found");
	}

	@Subscription(() => User, { topics: UserSubscribtion.New })
	async newUser(@Root() user: User): Promise<User> {
		return user;
	}

	@Subscription(() => User, { topics: UserSubscribtion.Delete })
	async deletedUser(@Root() user: User): Promise<User> {
		user.deleted = true;
		await user.save();
		return user;
	}
}
