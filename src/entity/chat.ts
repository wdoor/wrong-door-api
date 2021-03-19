import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import User from "./users";

@ObjectType()
@Entity()
export default class ChatMessage extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(() => Int)
  @Column({ nullable: false })
  userId: number;

  @Field(() => String, { nullable: false })
  @Column()
  message: string;

  @Field(() => Date, { nullable: false })
  @Column({ type: "datetime" })
  time: Date;
}
