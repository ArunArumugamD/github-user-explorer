// src/App.tsx
import React, { useState } from 'react';
import './styles/App.css';
import { githubService } from './services/github';
import { Repository, User } from './types';
import RepositoryList from './components/RepositoryList';
import UserInfo from './components/UserInfo';
import RepositoryDetails from './components/RepositoryDetails';
import FollowersList from './components/FollowersList';

type View = 'search' | 'repositories' | 'repository' | 'followers';

function App() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [currentView, setCurrentView] = useState<View>('search');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Fetching user data...');
      const userData = await githubService.getUser(username);
      console.log('User data:', userData);

      console.log('Fetching repositories...');
      const repos = await githubService.getUserRepositories(username);
      console.log('Repositories:', repos);

      setUser(userData);
      setRepositories(repos);
      setCurrentView('repositories');
    } catch (err) {
      console.error('Error:', err);
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRepositoryClick = (repo: Repository) => {
    setSelectedRepo(repo);
    setCurrentView('repository');
  };

  const handleFollowersClick = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const followersList = await githubService.getUserFollowers(user.username);
      setFollowers(followersList);
      setCurrentView('followers');
    } catch (err) {
      setError('Error fetching followers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">GitHub Explorer</h1>
      
      {currentView === 'search' && (
        <div className="search-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="search-input"
              disabled={loading}
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
        </div>
      )}

      {currentView === 'repositories' && user && (
        <>
          <UserInfo 
            user={user}
            onFollowersClick={handleFollowersClick}
          />
          <button 
            onClick={() => setCurrentView('search')}
            className="back-button"
          >
            ← Back to Search
          </button>
          <RepositoryList 
            repositories={repositories}
            onRepositoryClick={handleRepositoryClick}
          />
        </>
      )}

      {currentView === 'repository' && selectedRepo && (
        <RepositoryDetails
          repository={selectedRepo}
          onBack={() => setCurrentView('repositories')}
        />
      )}

      {currentView === 'followers' && (
        <FollowersList
          followers={followers}
          onFollowerClick={(followerUsername) => {
            setUsername(followerUsername);
            handleSubmit({ preventDefault: () => {} } as React.FormEvent);
          }}
          onBack={() => setCurrentView('repositories')}
        />
      )}

      {loading && <div className="loading-overlay">Loading...</div>}
    </div>
  );
}

export default App;