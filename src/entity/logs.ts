/* eslint-disable arrow-parens */
import User from "@Entities/users";
import { Field, Int, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import Command from "./commands";

@ObjectType()
@Entity()
export default class LogsMessage extends BaseEntity {
	// #region Regular Fields

	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => String, { nullable: false })
	@Column()
	message: string;

	@Field(() => Boolean)
	@Column({ default: false })
	deleted: boolean;

	@Field(() => Date, { nullable: false })
	@Column({ type: "datetime" })
	time: Date;

	// #endregion

	// #region Connection to Command
	@Field(() => Int, { nullable: false })
	@Column({ nullable: false })
	commandId: number;

	@Field(() => Command, { nullable: true })
	@OneToOne(() => Command, { eager: true, onDelete: "CASCADE" })
	@JoinColumn()
	command: Command;
	// #endregion

	// #region Connection to User
	@ManyToOne(() => User, (user) => user.LogsMessages)
	@JoinColumn({ name: "userId" })
	user: User;

	@Field(() => Int)
	@Column({ nullable: false })
	userId: number;
	// #endregion
}
