/* eslint-disable arrow-parens */
import { Field, Int, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import Command from "./commands";

@ObjectType()
@Entity()
export default class LogsMessage extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => Int, { nullable: false })
	@Column({ nullable: false })
	commandId: number;

	@Field(() => Command, { nullable: true })
	@OneToOne(() => Command, { eager: true, onDelete: "CASCADE" })
	@JoinColumn()
	command: Command;

	@Field(() => String, { nullable: false })
	@Column()
	username: string;

	@Field(() => String, { nullable: false })
	@Column()
	message: string;

	@Field(() => Boolean)
	@Column({ default: false })
	deleted: boolean;

	@Field(() => Date, { nullable: false })
	@Column({ type: "datetime" })
	time: Date;
}
