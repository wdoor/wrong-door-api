import User from "@Entities/users";
import { Field, Int, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import CommandType from "./command_types";

@ObjectType()
@Entity()
export default class Command extends BaseEntity {
	// #region Regular Fields

	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => String, { nullable: false })
	@Column()
	body: string;

	@Field(() => CommandType, { nullable: false })
	@Column()
	type: CommandType;

	@Field(() => Date, { nullable: false })
	@Column({ type: "datetime" })
	time: Date;

	@Field(() => Boolean, { nullable: false })
	@Column({ default: false })
	is_executed: boolean;

	@Field(() => Boolean)
	@Column({ default: false })
	deleted: boolean;

	// #endregion

	// #region Connection to user
	@ManyToOne(() => User, (user) => user.Commands)
	@JoinColumn({ name: "userId" })
	user: User;

	@Field(() => Int)
	@Column({ nullable: false })
	userId: number;
	// #endregion
}
