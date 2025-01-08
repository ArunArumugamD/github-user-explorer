// src/app.ts
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { User } from './models/User';
import * as dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

export const AppDataSource = new DataSource({
    type: "postgres", // Changed to postgres
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"), // Changed to postgres default port
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "github_explorer",
    synchronize: true,
    logging: true,
    entities: [User],
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    migrations: [],
    subscribers: [],
});

// Add this before other routes
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'GitHub Explorer API is running',
        endpoints: {
            users: '/api/users/:username',
            followers: '/api/users/:username/friends',
            search: '/api/users/search?query=:query'
        }
    });
});

// Enable CORS with specific options
app.use(cors({
    origin: 'https://github-user-frontend.onrender.com', // For development. In production, specify your frontend URL
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
});

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
        process.exit(1);
    });

export default app;