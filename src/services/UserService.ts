import { AppDataSource } from "../config/database";
import { User as userentity } from "../entities/User";
import { Token as TokenService } from "./TokenService"
import { AllUsersList, RegisterUserDTO, LoginUserDTO } from "../dtos/CreateUserDTO";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";


export class User {
    private userRepository = AppDataSource.getRepository(userentity);
    private tokenService = new TokenService()

    async registerUser(data: RegisterUserDTO): Promise<{ tokens: { accessToken: string, refreshToken: string } }> {
        const exitingUser = await this.userRepository.findOne({
            where: { email: data.email }
        })
        if (exitingUser) {
            throw new AppError("Email already registered", 409)
        }

        const hashpassword = await bcrypt.hash(data.password, 10)
        const user = this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashpassword
        });
        await this.userRepository.save(user);
        const tokens = this.tokenService.generateBothTokens({
            id: user.id,
            email: user.email,
            name: user.name,
        });
        return { tokens }
    }
    async userLogin(data: LoginUserDTO): Promise<{ tokens: { accessToken: string, refreshToken: string } }> {
        const User = await this.userRepository.findOne({
            where: { email: data.email },
            select: ['id', 'name', 'email', 'password']
        })
        if (!User) {
            throw new AppError("User not found", 404)
        }
        const isValid = bcrypt.compare(data.password, User.password);
        if (!isValid)
            throw new AppError("Invalid credientials", 401)
        const tokens = this.tokenService.generateBothTokens({
            id: User.id,
            email: User.email,
            name: User.name
        })
        return {tokens}
    }
    
    async AllUsers(): Promise<AllUsersList> {
        const users = await this.userRepository.find();
        return { users };
    }
    async updateUser(id: string, data: Partial<RegisterUserDTO>): Promise<void> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const updatedUser = { ...user, ...data }
        await this.userRepository.save(updatedUser);
    }
    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ id })
        if (!user) {
            throw new AppError(`User with this ${id} doesn't exit`, 404)
        }
        await this.userRepository.remove(user);
    }
    async refreshToken(refreshToken: string) {
        return this.tokenService.refreshAccessToken(refreshToken);
    }
}