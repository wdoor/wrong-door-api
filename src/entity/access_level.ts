import { registerEnumType } from "type-graphql";

/** Уровень доступа пользователя */
enum AccessLevel {
	Denied = 0,
	User = 1,
	Pro = 2,
	Admin = 3,
}

registerEnumType(AccessLevel, {
	name: "AccessLevel",
	description: "level of user access",
});

export default AccessLevel;
