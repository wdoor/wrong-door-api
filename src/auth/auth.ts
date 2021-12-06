import AccessLevel from "@Entities/access_level";
import User from "@Entities/users";
import { UserInput } from "@Resolvers/user/procedures/createUser";
import getAllLowerRoles from "auth/getAllLowerRoles";
import { AuthChecker } from "type-graphql";

type UserCredentials = UserInput & { iat: number };
export interface ContextType {
	user: UserCredentials | User | undefined;
}

type MyAuthMiddleware = AuthChecker<ContextType, AccessLevel>;

export const authMiddleware: MyAuthMiddleware = async ({ context }, roles) => {
	const credentials = context.user;

	if (!credentials) return false;

	const user = await User.findOne({
		where: {
			username: credentials.username,
			deviceid: credentials.deviceid,
		},
	});

	if (!user || user.isBlocked() || user.deleted) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	roles = getAllLowerRoles(user.access_level);

	context.user = user;

	return true;
};
