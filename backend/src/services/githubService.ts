// src/services/githubService.ts
import axios, { AxiosError } from 'axios';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

interface GitHubErrorResponse {
    message: string;
    documentation_url?: string;
}

export class GitHubService {
    private readonly baseUrl = 'https://api.github.com';
    private readonly headers = {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    };

    private handleError(error: unknown, context: string): never {  // Changed return type to never
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<GitHubErrorResponse>;
            if (axiosError.response?.status === 403) {
                throw new Error('GitHub API rate limit exceeded. Please try again later.');
            }
            throw new Error(`${context}: ${axiosError.response?.data?.message || axiosError.message}`);
        }
        throw error;
    }

    async fetchUserData(username: string): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/users/${username}`, {
                headers: this.headers
            });
            return response.data;
        } catch (error) {
            return this.handleError(error, 'Failed to fetch user data from GitHub');
        }
    }

    async fetchUserFollowers(username: string): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/users/${username}/followers`, {
                headers: this.headers
            });
            return response.data.map((follower: any) => follower.login);
        } catch (error) {
            return this.handleError(error, 'Failed to fetch followers');
        }
    }

    async fetchUserFollowing(username: string): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/users/${username}/following`, {
                headers: this.headers
            });
            return response.data.map((following: any) => following.login);
        } catch (error) {
            return this.handleError(error, 'Failed to fetch following');
        }
    }

    async saveUser(githubData: any): Promise<User> {
        try {
            console.log('Saving user data:', githubData.login);
            let user = await User.findOne({ where: { username: githubData.login } });
            
            if (!user) {
                user = new User();
                console.log('Creating new user');
            } else {
                console.log('Updating existing user');
            }

            Object.assign(user, {
                username: githubData.login,
                name: githubData.name,
                avatar_url: githubData.avatar_url,
                bio: githubData.bio,
                location: githubData.location,
                blog: githubData.blog,
                public_repos: githubData.public_repos,
                public_gists: githubData.public_gists,
                followers: githubData.followers,
                following: githubData.following
            });

            const followers = await this.fetchUserFollowers(githubData.login);
            const following = await this.fetchUserFollowing(githubData.login);
            user.friend_users = followers.filter(f => following.includes(f));

            console.log('Saving user to database...');
            const savedUser = await user.save();
            console.log('User saved successfully');
            
            return savedUser;
        } catch (error) {
            return this.handleError(error, 'Failed to save user');
        }
    }
}