// src/models/User.ts
import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
  } from "typeorm";
  
  @Entity("users")
  export class User extends BaseEntity {
    @PrimaryColumn()
    username!: string;
  
    @Column({ nullable: true })
    name!: string;
  
    @Column({ nullable: true })
    avatar_url!: string;
  
    @Column({ nullable: true })
    bio!: string;
  
    @Column({ nullable: true })
    location!: string;
  
    @Column({ nullable: true })
    blog!: string;
  
    @Column({ type: "int", default: 0 })
    public_repos!: number;
  
    @Column({ type: "int", default: 0 })
    public_gists!: number;
  
    @Column({ type: "int", default: 0 })
    followers!: number;
  
    @Column({ type: "int", default: 0 })
    following!: number;
  
    @Column("simple-array", { nullable: true })
    following_users!: string[];
  
    @Column("simple-array", { nullable: true })
    follower_users!: string[];
  
    @Column("simple-array", { nullable: true })
    friend_users!: string[];
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    @Column({ default: false })
    is_deleted!: boolean;
  }