// src/services/github.ts
import axios from 'axios';
import { User, Repository } from '../types';
const GITHUB_API = 'https://api.github.com';
// Add authorization header if token exists
const headers = {
  'Authorization': `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};
export const githubService = {
  async getUser(username: string): Promise<User> {
    const response = await axios.get(`${GITHUB_API}/users/${username}`, { headers });
    return response.data;
  },
  async getUserRepositories(username: string): Promise<Repository[]> {
    const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, { headers });
    return response.data;
  },
  async getUserFollowers(username: string): Promise<User[]> {
    const response = await axios.get(`${GITHUB_API}/users/${username}/followers`, { headers });
    // Get full user data for each follower
    const followersWithDetails = await Promise.all(
      response.data.map(async (follower: any) => {
        const userResponse = await axios.get(`${GITHUB_API}/users/${follower.login}`, { headers });
        return userResponse.data;
      })
    );
    return followersWithDetails;
  }
};