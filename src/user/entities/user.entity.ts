import { BaseEntity } from "../../shared/base.entity";
import { Entity, Column } from "typeorm";

// TODO: candidate to remove
export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum UserRole {
  USER = "USER",
  EMPLOYEE = "EMPLOYEE",
  BUSINESS_PARTNER = "BUSINESS_PARTNER",
  ADMIN = "ADMIN",
}

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column()
  email: string;

  @Column({ type: "json", default: {} })
  metadata: object;

  //TODO: credit or subscription will need to be in its own module

  @Column({
    type: "enum",
    enum: UserRole,
    default: [UserRole.USER],
  })
  roles: string[];

  @Column({ length: 100 })
  timezone: string;
}

// @Entity()
// export class Profile extends BaseEntity {

// }
