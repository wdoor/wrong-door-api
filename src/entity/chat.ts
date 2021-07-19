import { Field, Int, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
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

	@Field(() => Boolean)
	@Column({ default: false })
	deleted: boolean;
}
