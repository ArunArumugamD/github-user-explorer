// src/components/UserInfo.tsx
import React from 'react';
import { User } from '../types';
import '../styles/UserInfo.css';

interface UserInfoProps {
  user: User;
  onFollowersClick: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, onFollowersClick }) => {
  return (
    <div className="user-info">
      <div className="user-header">
        <img 
          src={user.avatar_url} 
          alt={`${user.login}'s avatar`} 
          className="user-avatar" 
        />
        <div className="user-details">
          <h2 className="user-name">{user.name || user.login}</h2>
          <div className="user-bio">{user.bio}</div>
          <div className="user-stats">
            <span>{user.public_repos} repositories</span>
            <button 
              onClick={onFollowersClick} 
              className="followers-button"
            >
              {user.followers} followers
            </button>
            <span>{user.following} following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;