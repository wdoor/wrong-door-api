import { Field, Int, ObjectType } from "type-graphql";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
} from "typeorm";

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

    @Field(() => Int, { nullable: false })
    @Column()
    type: number;

    @Field(() => Date, { nullable: false })
    @Column({ type: "datetime" })
    time: Date;
}
