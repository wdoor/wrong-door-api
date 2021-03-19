import { Field, Int, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import AccessLevel from "../access_level";

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
  @Column({ default: AccessLevel.Denied })
  access_level: number;

  @Field(() => Date, { nullable: false })
  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  last_online_time: Date;

  @Field(() => String, { nullable: true })
  @Column("longtext", { nullable: true })
  image: string;
}
