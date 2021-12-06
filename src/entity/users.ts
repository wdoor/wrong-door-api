import ChatMessage from "@Entities/chat";
import Command from "@Entities/commands";
import LogsMessage from "@Entities/logs";
import { Field, Int, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import AccessLevel from "./access_level";

@ObjectType()
@Entity()
export default class User extends BaseEntity {
	// #region Regular Fields

	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => String, { nullable: false })
	@Column()
	deviceid: string;

	@Field(() => String, { nullable: false })
	@Column()
	username: string;

	@Field(() => AccessLevel, { nullable: false })
	@Column({ default: AccessLevel.Denied })
	access_level: number;

	@Field(() => Boolean)
	@Column({ default: false })
	deleted: boolean;

	@Field(() => Date, { nullable: false })
	@Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	last_online_time: Date;

	@Field(() => String, { nullable: true })
	@Column({ nullable: true })
	image: string;
	// #endregion

	// #region Connection To Tables
	@OneToMany(() => ChatMessage, (message) => message.user)
	ChatMessages: ChatMessage[];

	@OneToMany(() => LogsMessage, (message) => message.user)
	LogsMessages: LogsMessage[];

	@OneToMany(() => Command, (command) => command.user)
	Commands: Command[];
	// #endregion

	// #region Methods
	public isAdmin(): boolean {
		return this.access_level === AccessLevel.Admin;
	}

	public isBlocked(): boolean {
		return this.access_level === AccessLevel.Denied;
	}
	// #endregion
}
