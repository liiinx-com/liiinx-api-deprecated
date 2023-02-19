import { BaseEntity } from "src/shared/base.entity";
import {
  Entity,
  Column,
  OneToOne,
  VersionColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity()
export class Content extends BaseEntity {
  @Column({ length: 50, name: "content-type" })
  contentType: string;

  @Column("text")
  content: string;

  @Column("int")
  version: number;
}
export class Post extends Content {}
