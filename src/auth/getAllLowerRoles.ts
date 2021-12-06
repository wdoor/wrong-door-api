import AccessLevel from "@Entities/access_level";

const getAllLowerRoles = (level: AccessLevel): AccessLevel[] => {
	const allLowerRoles = Object.keys(AccessLevel)
		.filter(Number)
		.find((n) => Number(n) <= level);

	if (!allLowerRoles) {
		throw new Error("Cannot find roles of user");
	}

	return allLowerRoles as unknown as AccessLevel[];
};

export default getAllLowerRoles;
