import User from "@Entities/users";
import { Field, InputType, ObjectType, Publisher } from "type-graphql";
import jwt from "jsonwebtoken";
import Config from "@Config";

@InputType()
export class UserInput {
	@Field(() => String)
	deviceid: string;

	@Field(() => String)
	username: string;
}

@ObjectType()
export class Token {
	@Field(() => String)
	token: string;
}

interface UserCreatorProps {
	newUser: UserInput;
	publish: Publisher<User>;
}

export type UserCreator = (p: UserCreatorProps) => Promise<Token>;

export const addUser: UserCreator = async ({ newUser, publish }) => {
	const createdUser: User = User.create(newUser);

	const { deviceid, username }: UserInput = createdUser;

	const token = jwt.sign({ deviceid, username }, Config.SecretKey, {
		algorithm: "HS256",
	});

	await createdUser.save();

	await publish(createdUser);

	return { token };
};
