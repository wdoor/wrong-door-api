import { Field, Int, ObjectType } from "type-graphql";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export default class ChatMessage extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: false })
    @Column()
    username: string;

    @Field(() => String, { nullable: false })
    @Column()
    message: string;

    @Field(() => Date, { nullable: false })
    @Column({ type: "datetime" })
    time: Date;
}
