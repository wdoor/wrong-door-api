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
import Command from "../entity/commands";
import LogsMessage from "../entity/logs";

@InputType()
class LogsMessageInput {
  @Field(() => String)
  message: string;

  @Field(() => String)
  username: string;

  @Field(() => Int)
  commandId: number;
}

@Resolver()
export default class LogsResolver {
  @Query(() => [LogsMessage])
  async Logs(@Arg("id", () => Int, { nullable: true }) id: number) {
    let messages;
    if (id === undefined) {
      messages = await LogsMessage.find();
    } else {
      messages = await LogsMessage.find({ id: MoreThan(id) });
    }
    return messages;
  }

  @Mutation(() => LogsMessage)
  async AddLog(
    @Arg("log", () => LogsMessageInput, { nullable: false })
    message: LogsMessageInput
  ): Promise<LogsMessage> {
    const created_log = await LogsMessage.create({
      message: message.message,
      username: message.username,
      time: new Date(),
      commandId: message.commandId,
    } as LogsMessage).save();
    await Command.update({ id: created_log.commandId }, { is_executed: true });
    return created_log;
  }

  @Mutation(() => Boolean)
  async DeleteLog(
    @Arg("id", () => Int, { nullable: false }) to_delete_id: number
  ) {
    await LogsMessage.delete({ id: to_delete_id });
    return true;
  }
}
