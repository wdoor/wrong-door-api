import User from "@Entities/users";

interface UserFinderProps {
	user: User;
}

export type UserFinder = (p: UserFinderProps) => User | null;

export const findUser: UserFinder = ({ user }) => {
	if (user) {
		return user;
	}
	return null;
};
