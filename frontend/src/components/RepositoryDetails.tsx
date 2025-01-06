// src/components/RepositoryDetails.tsx
import React from 'react';
import { Repository } from '../types';
import '../styles/RepositoryDetails.css';

interface RepositoryDetailsProps {
  repository: Repository;
  onBack: () => void;
}

const RepositoryDetails: React.FC<RepositoryDetailsProps> = ({ repository, onBack }) => {
  return (
    <div className="repository-details">
      <button onClick={onBack} className="back-button">
        ← Back to Repository List
      </button>

      <h3 className="details-subtitle">Application</h3>
      <h1 className="details-title">{repository.name}</h1>

      <button className="setup-plan-button">
        Set up a plan
      </button>

      {repository.verified && (
        <div className="verification-section">
          <div className="verified-info">
            <span className="verified-badge">✓</span>
            <span>Verified by GitHub</span>
          </div>
          <p className="verification-text">
            GitHub confirms that this app meets the requirements for verification.
          </p>
        </div>
      )}

      <div className="categories-section">
        <h3>Categories</h3>
        <div className="category-tags">
          <span className="category-tag">Code review</span>
          <span className="category-tag">IDEs</span>
          <span className="category-tag">Free</span>
        </div>
      </div>

      <p className="repository-description">
        {repository.description}
      </p>
    </div>
  );
};

export default RepositoryDetails;