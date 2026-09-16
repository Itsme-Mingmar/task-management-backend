import Router from "express"
import { User as UserController } from "../controllers/UserController"
import { authenticate } from "../middlewares/auth";

const router = Router();
const userController = new UserController()
router.post('/auth/login', userController.userLogin.bind(userController));
router.post('/auth/logout', userController.userLogout.bind(userController));
router.post('/auth/refresh', userController.refreshToken.bind(userController));

router.post('/users', userController.createUser.bind(userController));  
router.get('/users', authenticate, userController.allUsers.bind(userController));
router.patch('/users/:id',authenticate, userController.updateUser.bind(userController));
router.delete('/users/:id',authenticate, userController.deleteUser.bind(userController));
export default router;