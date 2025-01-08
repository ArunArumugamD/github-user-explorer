// src/app.ts
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { User } from './models/User';
import * as dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create TypeORM connection
export const AppDataSource = new DataSource({
    type: "postgres", // Changed to postgres
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === 'production' ? true : false,
    extra: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : null
    },
    synchronize: true,
    logging: true,  // Set to true for debugging
    entities: [User],
    migrations: [],
    subscribers: [],
});

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://github-user-frontend.onrender.com'
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Routes
app.use('/api/users', userRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

const PORT = process.env.PORT || 3001;

// Initialize database connection and start server
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
        process.exit(1);
    });

export default app;