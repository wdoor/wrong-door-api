import {
    Resolver,
    Arg,
    Query,
    Int,
    Mutation,
    InputType,
    Field,
} from "type-graphql";
import User from "../entity/users";

@InputType()
class UserInput {
    @Field(() => String)
    deviceid: string;

    @Field(() => String)
    username: string;
}

@InputType()
class UserUpdateInput {
    @Field(() => String, { nullable: true })
    username?: string;

    @Field(() => Int, { nullable: true })
    access_level?: number;

    @Field(() => String, { nullable: true })
    image?: string;
}

@Resolver()
export default class UserResolver {
    @Query(() => [User])
    async Users() {
        const messages = await User.find();
        return (messages);
    }

    @Mutation(() => User)
    async UpdateUser(
        @Arg("id", () => Int) id: number,
        @Arg("updated", () => UserUpdateInput) updated: UserUpdateInput,
    ): Promise<User> {
        await User.update({ id }, updated);
        const updated_user = await User.findOneOrFail(id);
        return (updated_user);
    }

    @Mutation(() => User)
    async CreateUser(
        @Arg("User", () => UserInput, { nullable: false }) new_user: UserInput,
    ): Promise<User> {
        const created_user: User = await User.create(new_user).save();
        return (created_user);
    }

    @Mutation(() => Boolean)
    async DeleteUser(
        @Arg("id", () => Int, { nullable: false }) id: number,
    ) {
        await User.delete({ id });
        return (true);
    }
}
