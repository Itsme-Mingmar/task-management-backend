import express from "express";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./config/database";
import todoRouter from './routes/todoRoute';
import userRouter from './routes/userRoute';
import { errorHandler } from "./middlewares/ErrorHandler";
import { rateLimiter } from "./middlewares/rateLimiter";


const app = express();

class App {
    constructor() {
        app.use(express.json());
        app.use(cookieParser());
        app.use(rateLimiter);
        app.use('/api', todoRouter);
        app.use('/api', userRouter);
        app.use(errorHandler);
    }
    async start(): Promise<void> {
        try {
            await AppDataSource.initialize();
            console.log("Database connected");
            app.listen(5000, () => {
                console.log("Server is running on port 5000");
            });
        }
        catch (err) {
            console.log("Error on connection", err);
        }
    }
}
new App().start();
