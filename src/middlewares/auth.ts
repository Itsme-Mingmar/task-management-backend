import { Request, Response, NextFunction } from "express";
import { Token as TokenService } from "../services/TokenService"
import { AppError } from "../utils/AppError";

export interface Authrequest extends Request {
    user?: {
        id: string,
        email: string,
        name: string
    }
}
const tokenService = new TokenService();

export const authenticate = async (req: Authrequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new AppError('No token provided', 401);
        }
        const payload = tokenService.verifyAccessToken(token);

        req.user = {
            id: payload.id,
            email: payload.email,
            name: payload.name,
        };

        next();
    }catch(error){
        next(error);
    }

};