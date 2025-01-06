// src/controllers/userController.ts
import { Request, Response } from 'express';
import { Like } from 'typeorm';
import { User } from '../models/User';
import { GitHubService } from '../services/githubService';

export class UserController {
    private githubService: GitHubService;

    constructor() {
        this.githubService = new GitHubService();
    }

    // 1. Save GitHub user
    saveUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username } = req.params;
            
            // Check if user exists and is not deleted
            let user = await User.findOne({ 
                where: { username, is_deleted: false } 
            });

            if (user) {
                res.json(user);
                return;
            }

            // Fetch from GitHub API
            const githubData = await this.githubService.fetchUserData(username);
            user = await this.githubService.saveUser(githubData);
            
            res.json(user);
        } catch (error) {
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Failed to save user' 
            });
        }
    };

    // 2. Get user friends (mutual followers)
    getUserFriends = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username } = req.params;
            const user = await User.findOne({ 
                where: { username, is_deleted: false } 
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Return mutual followers
            res.json({ friends: user.friend_users || [] });
        } catch (error) {
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Failed to get friends' 
            });
        }
    };

    // 3. Search users
    searchUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { query } = req.query;
            const searchQuery = Like(`%${query}%`);

            const users = await User.find({
                where: [
                    { username: searchQuery, is_deleted: false },
                    { location: searchQuery, is_deleted: false },
                    { name: searchQuery, is_deleted: false }
                ]
            });

            res.json(users);
        } catch (error) {
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Search failed' 
            });
        }
    };

    // 4. Soft delete user
    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username } = req.params;
            const user = await User.findOne({ 
                where: { username, is_deleted: false } 
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            user.is_deleted = true;
            await user.save();
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Deletion failed' 
            });
        }
    };

    // 5. Update user fields
    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username } = req.params;
            const { location, blog, bio } = req.body;

            const user = await User.findOne({ 
                where: { username, is_deleted: false } 
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            if (location) user.location = location;
            if (blog) user.blog = blog;
            if (bio) user.bio = bio;

            await user.save();
            res.json(user);
        } catch (error) {
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Update failed' 
            });
        }
    };

    // 6. Get sorted users list
    getSortedUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { sortBy = 'created_at', order = 'DESC' } = req.query;
            
            // Validate sort field
            const validFields = ['public_repos', 'public_gists', 'followers', 'following', 'created_at'];
            if (!validFields.includes(sortBy as string)) {
                res.status(400).json({ error: 'Invalid sort field' });
                return;
            }

            const users = await User.find({
                where: { is_deleted: false },
                order: { [sortBy as string]: order }
            });

            res.json(users);
        } catch (error) {
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Failed to get users' 
            });
        }
    };
}