import { AppDataSource } from "../config/database";
import { Todo as todoentity } from "../entities/Todo";
import { User as userentity } from "../entities/User"
import { redisClient } from "../config/redis";
import { CreateTodoDTO, TodoListDTO } from "../dtos/CreateTodoDTO";
import { AppError } from "../utils/AppError";
import { Email as EmailService } from "./EmailService";

export class Todo {
    private readonly CACHE_KEY = "todos:all";
    private readonly CACHE_TTL = 60;
    private todoRepository = AppDataSource.getRepository(todoentity);
    private userRepository = AppDataSource.getRepository(userentity);
    private EmailService = new EmailService();

    async createTodo(userId: string, data: CreateTodoDTO): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new AppError("User not found", 404)
        };
        const todo = this.todoRepository.create({
            title: data.title,
            description: data.description,
            user: user,
            userId: userId
        })
        await this.todoRepository.save(todo);
        await redisClient.del(this.CACHE_KEY);
        await this.EmailService.sendCreatedEmail(user.email)
        console.log("Cache deleted");
    }
    async AllTodos(userId: string): Promise<TodoListDTO> {
        const cachedTodos = await redisClient.get(this.CACHE_KEY);
        if (cachedTodos) {
            console.log("Returning todos from cache");
            return { todos: JSON.parse(cachedTodos) };
        }
        const todos = await this.todoRepository.find({where: {userId}});
        await redisClient.set(this.CACHE_KEY, JSON.stringify(todos), 'EX', this.CACHE_TTL);
        return { todos };
    }
    async updateTodo(id: number, userId: string, data: Partial<CreateTodoDTO>): Promise<void> {
        const todo = await this.todoRepository.findOneBy({ id, userId });
        if (!todo) {
            throw new AppError(`Todo with this id${id} not found`, 404);
        }
        const updatedTodo = { ...todo, ...data };
        await this.todoRepository.save(updatedTodo);
        await redisClient.del(this.CACHE_KEY);
        console.log("Cache deleted");
    }
    async completedTodo(id: number, userId:string): Promise<void> {
        const todo = await this.todoRepository.findOneBy({ id, userId });
        if (!todo) {
            throw new AppError(`Todo with this id${id} not found`, 404);
        }
        todo.completed = true;
        await this.todoRepository.save(todo);
        await redisClient.del(this.CACHE_KEY)
        await this.EmailService.sendCompletedEmail();
    }
    async deleteTodo(id: number, userId: string): Promise<void> {
        const todo = await this.todoRepository.findOneBy({ id, userId });
        if (!todo) {
            throw new AppError(`Todo with this id${id} not found`, 404);
        }
        await this.todoRepository.remove(todo);
        await redisClient.del(this.CACHE_KEY);
        console.log("Cache deleted");
    }
}