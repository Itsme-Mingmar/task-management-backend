import {Entity, PrimaryGeneratedColumn,Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { User } from "./User";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string;

    @Column()
    description:string;

    @Column({default: false})
    completed: boolean;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;
    
    @ManyToOne(()=> User, user=> user.todos,{
        onDelete: "CASCADE", 
    })
    @JoinColumn({name: "user_id"})
    user: User;

    @Column({name: "user_id"})
    userId: string;
}
