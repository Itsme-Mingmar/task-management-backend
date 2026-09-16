import { Request, Response } from "express";
import { User as userService } from "../services/UserService"
import { RegisterUserDTO } from "../dtos/CreateUserDTO";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export class User {
    private userService: userService;

    constructor() {
        this.userService = new userService();
    }

    private setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {

        res.cookie('accessToken', accessToken, {
            httpOnly: true, 
            secure: false, 
            sameSite: 'lax', 
            maxAge: 15 * 60 * 1000, 
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
    }
    private setAccessTokenCookie(res: Response, accessToken: string) {

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
    }

    createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new AppError("Required all fields", 400)
        }
        const result = await this.userService.registerUser({ name, email, password })
        this.setTokenCookies(res, result.tokens.accessToken, result.tokens.refreshToken)
        res.status(201).json({ message: "User created successfully"})
    })
    userLogin = asyncHandler(async(req:Request, res: Response): Promise<void> =>{
        const {email, password} = req.body;
        if  (!email || !password) {
            throw new AppError("Required all fields", 400)
        }
        const result = await this.userService.userLogin({email, password});
        this.setTokenCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
        res.status(200).json({message: "User login successfully"});
    })
    userLogout = asyncHandler(async(req:Request, res: Response)=>{
        res.clearCookie('accessToken',{
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        })
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        })
        res.status(200).json({message:"Logout successfully"});
    })

    allUsers = asyncHandler(async(req: Request, res: Response): Promise<void> =>{
        const users = await this.userService.AllUsers();
        res.status(200).json(users);
    })

    updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = String(req.params.id);
        const { name, email, password } = req.body;
        if (!name && !email && !password) {
            throw new AppError("Atleast one field required", 400)
        }
        const updateData: Partial<RegisterUserDTO>={}
        if (name !== undefined) {
            updateData.name = name;
        }
        if (email !== undefined) {
            updateData.email = email;
        }
        if (password !== undefined){
            updateData.password = password;
        }
        await this.userService.updateUser(id, updateData)
        res.status(200).json({message: "User Update successfully"})
    })
    deleteUser = asyncHandler(async(req:Request, res: Response):Promise<void>=>{
        const id = String(req.params.id);
        await this.userService.deleteUser(id)
        res.status(200).json({message: "User deleted successfully"});
    })
    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new AppError('Refresh token required', 400);
        }
        const result = await this.userService.refreshToken(refreshToken);

        this.setAccessTokenCookie(res, result.accessToken);

        res.status(200).json({message: 'Token refreshed'});
    });
}