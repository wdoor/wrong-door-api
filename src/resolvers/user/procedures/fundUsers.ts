import User from "@Entities/users";

export type UsersFinder = () => Promise<User[]>;

export const findUsers: UsersFinder = async () => {
	const users = await User.find({ deleted: false });
	return users;
};
