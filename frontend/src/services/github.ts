// src/services/github.ts
import axios from 'axios';
import { User, Repository } from '../types';

const API_URL = process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_API_URL}/api`
    : 'http://localhost:3001/api';

// Add authorization header if token exists
const headers = {
    'Authorization': `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
};

export const githubService = {
    async getUser(username: string): Promise<User> {
        try {
            const response = await axios.get(`${API_URL}/users/${username}`, {
                headers,
                withCredentials: true
            });
            console.log('User response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    async getUserRepositories(username: string): Promise<Repository[]> {
        try {
            const response = await axios.get(`${API_URL}/users/${username}/repos`, {
                headers,
                withCredentials: true
            });
            console.log('Repos response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching repositories:', error);
            throw error;
        }
    },

    async getUserFollowers(username: string): Promise<User[]> {
        try {
            const response = await axios.get(`${API_URL}/users/${username}/followers`, {
                headers,
                withCredentials: true
            });
            console.log('Followers response:', response.data);
            // Get full user data for each follower
            const followersWithDetails = await Promise.all(
                response.data.map(async (follower: any) => {
                    const userResponse = await axios.get(`${API_URL}/users/${follower.login}`, {
                        headers,
                        withCredentials: true
                    });
                    return userResponse.data;
                })
            );
            return followersWithDetails;
        } catch (error) {
            console.error('Error fetching followers:', error);
            throw error;
        }
    }
};