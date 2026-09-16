import jwt from 'jsonwebtoken';
import { AppError } from "../utils/AppError";


export interface TokenPayload {
    id: string,
    email: string,
    name: string
}

export class Token {
    private accessSecret = process.env.ACCESS_TOKEN_SECRET;
    private accessExpiry = Number(process.env.ACCESS_TOKEN_EXPIRY);
    private refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    private refreshExpiry = Number(process.env.REFRESH_TOKEN_EXPIRY);

    generateAccessToken(Payload: TokenPayload): string {
        return jwt.sign(Payload, this.accessSecret, {
            expiresIn: this.accessExpiry
        });
    }

    generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.refreshSecret, {
            expiresIn: this.refreshExpiry,
        });
    }
    generateBothTokens(payload: TokenPayload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.accessSecret) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError("Access token expired", 401)
            }
            throw new AppError('Invalid access token', 401);
        }
    }
    verifyRefressToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.refreshSecret) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError("Refresh token expired", 401)
            }
            throw new AppError('Invalid refresh token', 401);
        }
    }
    refreshAccessToken(refreshToken: string): { accessToken: string } {
        const payload = this.verifyRefressToken(refreshToken);

        const newAaccessToken = this.generateAccessToken({
            id: payload.id,
            email: payload.email,
            name: payload.name
        })
        return {
            accessToken: newAaccessToken
        }
    }
}