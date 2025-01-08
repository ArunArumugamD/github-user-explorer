// src/services/github.ts
import axios from 'axios';
import { User, Repository } from '../types';

const GITHUB_API = 'https://api.github.com';

const headers = {
    'Accept': 'application/vnd.github.v3+json'
};

export const githubService = {
    async getUser(username: string): Promise<User> {
        try {
            // First try our backend
            const backendUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/users/${username}`;
            const response = await axios.post(backendUrl);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user:', error);
            throw new Error('Error fetching user data');
        }
    },

    async getUserRepositories(username: string): Promise<Repository[]> {
        try {
            const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, { headers });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch repositories:', error);
            throw new Error('Error fetching repositories');
        }
    },

    async getUserFollowers(username: string): Promise<User[]> {
        try {
            const backendUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/users/${username}/friends`;
            const response = await axios.get(backendUrl);
            return response.data.friends;
        } catch (error) {
            console.error('Failed to fetch followers:', error);
            throw new Error('Error fetching followers');
        }
    }
};