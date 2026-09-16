import 'reflect-metadata';
import { DataSource } from "typeorm";
import 'dotenv/config';
import path from 'path';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [path.join(__dirname, "../entities/**/*.ts")],
    migrations: [path.join(__dirname, "../migrations/**/*.ts")],
    synchronize: false,
    logging: true
})