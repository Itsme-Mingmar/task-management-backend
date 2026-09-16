import {Router} from 'express';
import { Todo as TodoController } from '../controllers/TodoController';
import { authenticate } from '../middlewares/auth';

const router = Router();
const todoController = new TodoController();

router.post('/todos',authenticate, todoController.createTodo.bind(todoController));
router.get('/todos', authenticate, todoController.getAllTodos.bind(todoController));
router.patch('/todos/:id', authenticate, todoController.updateTodo.bind(todoController));
router.patch('/todos/:id/complete', authenticate, todoController.completedTodo.bind(todoController));
router.delete('/todos/:id',authenticate, todoController.deleteTodo.bind(todoController));

export default router;