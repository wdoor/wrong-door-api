/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import {
    Resolver,
    Arg,
    Query,
    Int,
    Mutation,
    InputType,
    Field,
} from "type-graphql";
import AccessLevel from "../access_level";
import User from "../entity/users";

@InputType()
class UserInput {
    @Field(() => String)
    deviceid: string;

    @Field(() => String)
    username: string;
}

@Resolver()
export default class UserResolver {
    @Query(() => [User])
    async GetUsers() {
        const messages = await User.find();
        return (messages);
    }

    @Mutation(() => Boolean)
    async AddUser(
        @Arg("User", () => UserInput, { nullable: false }) user: UserInput,
    ) {
        await User.insert({
            deviceid: user.deviceid,
            username: user.username,
            access_level: (AccessLevel.Denied as number),
            password: "",
            last_online_time: new Date(),
        } as User);
        return (true);
    }

    @Mutation(() => Boolean)
    async DeleteUser(
        @Arg("id", () => Int, { nullable: false }) to_delete_id: number,
    ) {
        await User.delete({ id: to_delete_id });
        return (true);
    }
}
