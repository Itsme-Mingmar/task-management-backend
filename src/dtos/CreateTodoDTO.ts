export interface CreateTodoDTO {
    title: string;
    description: string;
}
export interface TodoListDTO {
    todos: CreateTodoDTO[];
}
