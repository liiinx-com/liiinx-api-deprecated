import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

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

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  serviceDeskUserId: string;

  //TODO: credit or subscription will need to be in its own module

  @Column({
    type: "enum",
    enum: UserRole,
    default: [UserRole.USER],
  })
  roles: string[];

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;
}
