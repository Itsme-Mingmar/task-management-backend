import {Entity, PrimaryGeneratedColumn,Column, OneToMany, CreateDateColumn, UpdateDateColumn} from "typeorm";

import { Todo } from "./Todo";

@Entity({name: "users"})
export class User{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    name:string;
    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
        length:100
    })
    email: string
    @Column({
        type:"varchar",
        nullable: false,
        unique: true,
        select: false
    })
    password: string;
    @CreateDateColumn({
        name: "created_at"
    })
    createdAt: Date;
    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt: Date;

    @OneToMany(()=>Todo, todo => todo.user)
    todos: Todo[];
}
