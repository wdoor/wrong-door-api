import User from "@Entities/users";
import { Field, InputType, Publisher } from "type-graphql";

@InputType()
export class UserInput {
	@Field(() => String)
	deviceid: string;

	@Field(() => String)
	username: string;
}

interface UserCreatorProps {
	newUser: UserInput;
	publish: Publisher<User>;
}

export type UserCreator = (p: UserCreatorProps) => Promise<User>;

export const addUser: UserCreator = async ({ newUser, publish }) => {
	const createdUser: User = await User.create(newUser).save();
	await publish(createdUser);
	return createdUser;
};
