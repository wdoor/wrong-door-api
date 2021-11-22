import User from "@Entities/users";
import { Publisher } from "type-graphql";

interface UserDeletorParams {
	userId: number;
	publish: Publisher<User>;
}

export type UserDeletor = (p: UserDeletorParams) => Promise<User>;

export const deleteUser: UserDeletor = async ({ userId, publish }) => {
	const userToDelete = await User.findOne({ id: userId });

	if (!userToDelete) {
		throw new Error("User not found");
	}

	userToDelete.deleted = true;
	await userToDelete.save();
	await publish(userToDelete);
	return userToDelete;
};
