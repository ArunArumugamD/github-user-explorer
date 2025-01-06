// src/types.ts
export interface User {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    location: string | null;
    blog: string;
    public_repos: number;
    followers: number;
    following: number;
  }
  
  export interface Repository {
    id: number;
    name: string;
    description: string;
    html_url: string;
    verified?: boolean;
    owner: {
      login: string;
      avatar_url: string;
    };
    stargazers_count: number;
    forks_count: number;
    language: string;
  }