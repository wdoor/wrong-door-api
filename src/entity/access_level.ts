import { registerEnumType } from "type-graphql";

/** Уровень доступа пользователя */
enum AccessLevel {
	User = 1,
	Pro = 2,
	Admin = 3,
	Denied = 4,
}

registerEnumType(AccessLevel, {
	name: "AccessLevel",
	description: "level of user access",
});

export default AccessLevel;
