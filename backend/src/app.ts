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

// Dynamic database configuration based on environment
export const AppDataSource = new DataSource({
    type: process.env.NODE_ENV === 'production' ? "postgres" : "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || process.env.NODE_ENV === 'production' ? "5432" : "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === 'production' ? true : false,
    extra: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : null
    },
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'GitHub Explorer API is running' });
});

// CORS configuration
app.use(cors({
    origin: ['https://github-user-frontend.onrender.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', async (req, res) => {
    try {
        await AppDataSource.query('SELECT 1');
        res.json({ 
            message: 'Backend is working!',
            database: 'Connected',
            environment: process.env.NODE_ENV
        });
    } catch (err: any) {
        res.status(500).json({ 
            message: 'Backend is running but database connection failed',
            error: err.message
        });
    }
});

// Routes
app.use('/api/users', userRoutes);

// Error handling
app.use((err: Error | any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
        console.log(`Database type: ${AppDataSource.options.type}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
        process.exit(1);
    });

export default app;