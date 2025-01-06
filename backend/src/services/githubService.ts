// src/services/githubService.ts
import axios from 'axios';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export class GitHubService {
    private readonly baseUrl = 'https://api.github.com';
    private readonly headers = {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    };

    async fetchUserData(username: string): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/users/${username}`, {
                headers: this.headers
            });
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to fetch user data from GitHub: ${error.response?.data?.message || error.message}`);
        }
    }

    async fetchUserFollowers(username: string): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/users/${username}/followers`, {
                headers: this.headers
            });
            return response.data.map((follower: any) => follower.login);
        } catch (error: any) {
            throw new Error(`Failed to fetch followers: ${error.response?.data?.message || error.message}`);
        }
    }

    async fetchUserFollowing(username: string): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/users/${username}/following`, {
                headers: this.headers
            });
            return response.data.map((following: any) => following.login);
        } catch (error: any) {
            throw new Error(`Failed to fetch following: ${error.response?.data?.message || error.message}`);
        }
    }

    async saveUser(githubData: any): Promise<User> {
        try {
            let user = await User.findOne({ where: { username: githubData.login } });
            
            if (!user) {
                user = new User();
            }

            user.username = githubData.login;
            user.name = githubData.name;
            user.avatar_url = githubData.avatar_url;
            user.bio = githubData.bio;
            user.location = githubData.location;
            user.blog = githubData.blog;
            user.public_repos = githubData.public_repos;
            user.public_gists = githubData.public_gists;
            user.followers = githubData.followers;
            user.following = githubData.following;

            const followers = await this.fetchUserFollowers(githubData.login);
            const following = await this.fetchUserFollowing(githubData.login);
            user.friend_users = followers.filter(f => following.includes(f));

            return await user.save();
        } catch (error: any) {
            throw new Error(`Failed to save user: ${error.message}`);
        }
    }
}