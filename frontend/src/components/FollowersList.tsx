// src/components/FollowersList.tsx
import React from 'react';
import { User } from '../types';
import '../styles/FollowersList.css';

interface FollowersListProps {
  followers: User[];
  onFollowerClick: (username: string) => void;
  onBack: () => void;
}

const FollowersList: React.FC<FollowersListProps> = ({ 
  followers, 
  onFollowerClick,
  onBack 
}) => {
  return (
    <div className="followers-container">
      <button onClick={onBack} className="back-button">
        ← Back to Repository List
      </button>
      
      <h2>Followers</h2>
      
      {followers.length === 0 ? (
        <div className="no-followers">
          No followers found
        </div>
      ) : (
        <div className="followers-grid">
          {followers.map((follower) => (
            <button
              key={follower.login}
              className="follower-card"
              onClick={() => onFollowerClick(follower.login)}
            >
              <img 
                src={follower.avatar_url} 
                alt={`${follower.login}'s avatar`}
                className="follower-avatar" 
              />
              <div className="follower-info">
                <h3>{follower.login}</h3>
                {follower.name && <p>{follower.name}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowersList;