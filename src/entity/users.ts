import { Field, Int, ObjectType } from "type-graphql";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export default class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: false })
    @Column()
    deviceid: string;

    @Field(() => String, { nullable: false })
    @Column()
    username: string;

    @Field(() => Int, { nullable: false })
    @Column({ default: 0 })
    access_level: number;

    @Field(() => String, { nullable: false })
    @Column()
    password: string;

    @Field(() => Date, { nullable: false })
    @Column({ type: "datetime" })
    last_online_time: Date;
}
