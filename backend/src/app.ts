import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { User } from './models/User';
import * as dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

// Configure CORS for production
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://github-user-explorer-8wcu.onrender.com'  // Your frontend URL
        : 'http://localhost:3000'
}));

// Create TypeORM connection
export const AppDataSource = new DataSource({
    type: "postgres",  // Changed to postgres
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    ssl: process.env.NODE_ENV === 'production',
    extra: {
        ssl: process.env.NODE_ENV === 'production' 
            ? { rejectUnauthorized: false }
            : null
    },
    entities: [User],
    migrations: [],
    subscribers: []
});

app.use(express.json());
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

export default app;