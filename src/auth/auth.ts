import AccessLevel from "@Entities/access_level";
import User from "@Entities/users";
import { Console } from "console";
import { AuthChecker } from "type-graphql";

export interface UserContext {
	username: string;
	deviceid: string;
}

export interface ContextType {
	user: User | undefined;
}

const getAllLowerRoles = (level: AccessLevel): AccessLevel[] => {
	const allLowerRoles = Object.keys(AccessLevel)
		.filter(Number)
		.find((n) => Number(n) <= level);

	if (!allLowerRoles) {
		throw new Error("Cannot find roles of user");
	}

	return allLowerRoles as unknown as AccessLevel[];
};

export const AuthMiddleware: AuthChecker<ContextType, AccessLevel> = async (
	{ context },
	roles,
) => {
	roles = [];

	const credentials = context.user;
	if (!credentials) return false;

	const user = await User.findOne({ where: credentials });

	if (user) {
		if (user.access_level === AccessLevel.Denied) {
			return false;
		}

		roles.push(...getAllLowerRoles(user.access_level));

		return true;
	}

	return false;
};
