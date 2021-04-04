import { Field, Int, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import CommandType from "./command_types";

@ObjectType()
@Entity()
export default class Command extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: false })
  @Column()
  body: string;

  @Field(() => String, { nullable: false })
  @Column()
  username: string;

  @Field(() => CommandType, { nullable: false })
  @Column()
  type: CommandType;

  @Field(() => Date, { nullable: false })
  @Column({ type: "datetime" })
  time: Date;

  @Field(() => Boolean, { nullable: false })
  @Column({ default: false })
  is_executed: boolean;
}
