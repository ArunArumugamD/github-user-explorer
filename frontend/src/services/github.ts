// src/services/github.ts
import axios from 'axios';
import { User, Repository } from '../types';

const GITHUB_API = 'https://api.github.com';

const headers = {
  'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`, // Changed from Bearer to token
  'Accept': 'application/vnd.github.v3+json'
};

export const githubService = {
  async getUser(username: string): Promise<User> {
    try {
      const response = await axios.get(`${GITHUB_API}/users/${username}`, { headers });
      return response.data;
    } catch (error: any) {
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  async getUserRepositories(username: string): Promise<Repository[]> {
    try {
      const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, { headers });
      return response.data;
    } catch (error: any) {
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  async getUserFollowers(username: string): Promise<User[]> {
    try {
      const response = await axios.get(`${GITHUB_API}/users/${username}/followers`, { headers });
      const followersWithDetails = await Promise.all(
        response.data.map(async (follower: any) => {
          const userResponse = await axios.get(`${GITHUB_API}/users/${follower.login}`, { headers });
          return userResponse.data;
        })
      );
      return followersWithDetails;
    } catch (error: any) {
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }
};