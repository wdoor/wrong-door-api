import User from "@Entities/users";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class UserUpdateInput {
	@Field(() => String, { nullable: true })
	username?: string;

	@Field(() => Int, { nullable: true })
	access_level?: number;

	@Field(() => String, { nullable: true })
	image?: string;
}

interface UserUpdaterProps {
	userId: number;
	updateFields: UserUpdateInput;
	user: User;
}

export type UserUpdater = (p: UserUpdaterProps) => Promise<User>;

export const updateUser: UserUpdater = async ({
	updateFields,
	userId,
	user,
}) => {
	if (user.id !== userId && !user.isAdmin()) {
		throw new Error("You are trying to update wrong user");
	}

	await User.update({ id: userId }, updateFields);

	const updatedUser = await User.findOneOrFail(userId);

	return updatedUser;
};
