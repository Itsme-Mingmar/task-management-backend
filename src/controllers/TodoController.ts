import { Todo as todoService } from "../services/TodoService";
import { CreateTodoDTO } from "../dtos/CreateTodoDTO";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { Response } from "express";
import { Authrequest } from "../middlewares/auth";

export class Todo {
    private todoService: todoService;

    constructor() {
        this.todoService = new todoService();
    }
    createTodo = asyncHandler(async (req: Authrequest, res: Response) => {
        const userId = req.user?.id;
        const { title, description} = req.body;
        if (!title || !description ) {
            throw new AppError("Title and description are required", 400);
        }
        await this.todoService.createTodo( userId, { title, description });
        res.status(201).json({ message: "Todo created successfully" });
    });

    getAllTodos = asyncHandler(async (req: Authrequest, res: Response) => {
        const userId = req.user?.id;
        const todos = await this.todoService.AllTodos(userId);
        res.status(200).json(todos);
    });

    updateTodo = asyncHandler(async (req: Authrequest, res: Response) => {
        const userId = req.user?.id;
        const id = Number(req.params.id);
        const { title, description} = req.body;
        if (title == undefined && description == undefined ) {
            throw new AppError("At least one of title or description must be provided", 400);
        }
        const updateData: Partial<CreateTodoDTO> = {};
        if (title !== undefined) {
            updateData.title = title;
        }
        if (description !== undefined) {
            updateData.description = description;
        }
        await this.todoService.updateTodo(id,userId, updateData);
        res.status(200).json({ message: "updated successfully" });
    });
    
    completedTodo = asyncHandler(async(req: Authrequest, res: Response)=>{
        const userId = req.user?.id;
        const id = Number(req.params.id);
        await this.todoService.completedTodo(id, userId);
        res.status(200).json({message:"Mark complete successfully"})
    })
    deleteTodo = asyncHandler(async (req: Authrequest, res: Response) => {
        const userId = req.user?.id;
        const id = Number(req.params.id);
        await this.todoService.deleteTodo(id, userId);
        res.status(200).json({ message: "Todo deleted successfully" });
    });
}