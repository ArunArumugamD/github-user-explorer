import axios, { AxiosError } from 'axios';
import { User, Repository } from '../types';

// Add interface for error response
interface ErrorResponse {
    message?: string;
    error?: string;
    status?: string;
}

const API_URL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:3001';

const headers = {
    'Authorization': `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
};

export const githubService = {
    async getUser(username: string): Promise<User> {
        try {
            const response = await axios.get(`${API_URL}/api/users/${username}`, {
                headers,
                withCredentials: true
            });
            console.log('User response:', response.data);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<ErrorResponse>;
            console.error('Error fetching user:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user data');
        }
    },

    async getUserRepositories(username: string): Promise<Repository[]> {
        try {
            const response = await axios.get(`${API_URL}/api/users/${username}/repos`, {
                headers,
                withCredentials: true
            });
            console.log('Repos response:', response.data);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<ErrorResponse>;
            console.error('Error fetching repositories:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch repositories');
        }
    },

    async getUserFollowers(username: string): Promise<User[]> {
        try {
            const response = await axios.get(`${API_URL}/api/users/${username}/followers`, {
                headers,
                withCredentials: true
            });
            console.log('Followers response:', response.data);
            
            const followersWithDetails = await Promise.all(
                response.data.map(async (follower: any) => {
                    const userResponse = await axios.get(`${API_URL}/api/users/${follower.login}`, {
                        headers,
                        withCredentials: true
                    });
                    return userResponse.data;
                })
            );
            return followersWithDetails;
        } catch (err: unknown) {
            const error = err as AxiosError<ErrorResponse>;
            console.error('Error fetching followers:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch followers');
        }
    }
};