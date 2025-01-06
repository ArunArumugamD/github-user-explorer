// src/components/RepositoryList.tsx
import React from 'react';
import { Repository } from '../types';
import '../styles/RepositoryList.css';

interface RepositoryListProps {
  repositories: Repository[];
  onRepositoryClick: (repo: Repository) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, onRepositoryClick }) => {
  return (
    <div className="repository-list">
      {repositories.map((repo) => (
        <div key={repo.id} className="repository-item">
          <div className="repository-icon">
            <img 
              src={repo.owner.avatar_url} 
              alt="Repository icon"
            />
          </div>
          <div className="repository-content">
            <div className="repository-name">
              <button 
                onClick={() => onRepositoryClick(repo)}
                className="repository-link"
              >
                {repo.name}
              </button>
              {repo.verified && (
                <span className="verified-badge">✓</span>
              )}
            </div>
            <p className="repository-description">
              {repo.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RepositoryList;