import { registerEnumType } from "type-graphql";

enum CommandType {
	CMD = 1,
	PSEXEC = 2,
	VIRUS = 3,
	JUMPSCARE = 4,
}

registerEnumType(CommandType, {
	name: "CommandType",
	description: "what u wanna to do",
});

export default CommandType;
