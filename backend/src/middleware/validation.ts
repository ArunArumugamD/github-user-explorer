// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    // Validate username
    if (req.params.username) {
        if (!/^[a-zA-Z0-9-]+$/.test(req.params.username)) {
            throw new AppError(400, 'Invalid username format');
        }
    }

    // Validate update fields
    if (req.method === 'PATCH') {
        const { location, blog, bio } = req.body;
        const updates: any = {};

        if (location !== undefined) {
            if (typeof location !== 'string' || location.length > 100) {
                throw new AppError(400, 'Invalid location format');
            }
            updates.location = location;
        }

        if (blog !== undefined) {
            if (typeof blog !== 'string' || blog.length > 255) {
                throw new AppError(400, 'Invalid blog URL format');
            }
            updates.blog = blog;
        }

        if (bio !== undefined) {
            if (typeof bio !== 'string' || bio.length > 500) {
                throw new AppError(400, 'Invalid bio format');
            }
            updates.bio = bio;
        }

        req.body = updates;
    }

    next();
};