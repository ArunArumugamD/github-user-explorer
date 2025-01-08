// src/services/github.ts
import axios, { AxiosError } from 'axios';
import { User, Repository } from '../types';

const GITHUB_API = 'https://api.github.com';

interface GitHubErrorResponse {
  message: string;
  documentation_url?: string;
}

const getHeaders = () => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    if (!token) {
        console.warn('GitHub token not found in environment variables');
    }
    
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/vnd.github.v3+json'
    };
};

const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<GitHubErrorResponse>;
        if (axiosError.response?.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
        } else if (axiosError.response?.status === 404) {
            throw new Error('User not found');
        }
        throw new Error(axiosError.response?.data?.message || 'Error accessing GitHub API');
    }
    throw new Error('An unexpected error occurred');
};

export const githubService = {
    async getUser(username: string): Promise<User> {
        try {
            const response = await axios.get(`${GITHUB_API}/users/${username}`, { 
                headers: getHeaders() 
            });
            return response.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    },

    async getUserRepositories(username: string): Promise<Repository[]> {
        try {
            const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, { 
                headers: getHeaders() 
            });
            return response.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    },

    async getUserFollowers(username: string): Promise<User[]> {
        try {
            const response = await axios.get(`${GITHUB_API}/users/${username}/followers`, { 
                headers: getHeaders() 
            });
            
            const followersWithDetails = await Promise.all(
                response.data.map(async (follower: any) => {
                    try {
                        const userResponse = await axios.get(
                            `${GITHUB_API}/users/${follower.login}`,
                            { headers: getHeaders() }
                        );
                        return userResponse.data;
                    } catch (error) {
                        console.error(`Error fetching details for follower ${follower.login}:`, error);
                        return follower; // Return basic follower info if detailed fetch fails
                    }
                })
            );
            return followersWithDetails;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }
};