// src/services/github.ts
import axios from 'axios';
import { User, Repository } from '../types';

const GITHUB_API = 'https://api.github.com';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
};

export const githubService = {
    async getUser(username: string): Promise<User> {
        try {
            const response = await axios.post(`${BASE_URL}/users/${username}`);
            if (!response.data) throw new Error('No data received');
            return response.data;
        } catch (error: any) {
            console.error('Error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Error fetching data');
        }
    },

    async getUserRepositories(username: string): Promise<Repository[]> {
        const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, { headers });
        return response.data;
    },

    async getUserFollowers(username: string): Promise<User[]> {
        const response = await axios.get(`${BASE_URL}/users/${username}/friends`);
        return response.data.friends || [];
    }
};