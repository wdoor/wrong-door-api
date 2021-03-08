import {
    Resolver,
    Arg,
    Query,
    Int,
    Mutation,
    InputType,
    Field,
} from "type-graphql";
import { MoreThan } from "typeorm";
import OutputMessage from "../entity/output";

@InputType()
class OutputMessageInput {
    @Field(() => String)
    message: string;

    @Field(() => String)
    username: string;
}

@Resolver()
export default class OutputResilver {
    @Query(() => [OutputMessage])
    async Output(
        @Arg("id", () => Int, { nullable: true }) id: number,
    ) {
        let messages;
        if (id === undefined) {
            messages = await OutputMessage.find();
        } else {
            messages = await OutputMessage.find({ id: MoreThan(id) });
        }
        return (messages);
    }

    @Mutation(() => OutputMessage)
    async AddOutput(
        @Arg("message", () => OutputMessageInput, { nullable: false }) message: OutputMessageInput,
    ): Promise<OutputMessage> {
        const created_output = await OutputMessage.create({
            message: message.message,
            username: message.username,
            time: new Date(),
        } as OutputMessage).save();
        return (created_output);
    }

    @Mutation(() => Boolean)
    async DeleteOutput(
        @Arg("id", () => Int, { nullable: false }) to_delete_id: number,
    ) {
        await OutputMessage.delete({ id: to_delete_id });
        return (true);
    }
}
