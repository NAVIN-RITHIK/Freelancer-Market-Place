import React, { useState, useEffect } from 'react';
import { getAllFreelancers, getFreelancersBySkill } from '../api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const tagColor = {
  background: 'var(--bg-gray-100)',
  borderRadius: '6px',
  padding: '0.16rem 0.6rem',
  margin: '0 0.3rem 0.3rem 0',
  display: 'inline-block',
  fontSize: '0.95em',
  color: 'var(--text-secondary)',
};

function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    (filter ? getFreelancersBySkill(filter) : getAllFreelancers())
      .then(setFreelancers)
      .catch((e) => setError(e.message || 'Failed to fetch freelancers'))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter(searchValue.trim());
  };

  return (
    <div className="container">
      <h2 className="page-title">Freelancers</h2>
      <form className="search-section" onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <input
          style={{ maxWidth: 220 }}
          aria-label="Search by skill"
          type="text"
          placeholder="Search by skill (e.g. React)"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          data-testid="search-input"
        />
        <button className="btn-primary" style={{ marginLeft: 8 }} type="submit">Search</button>
        <button className="btn-secondary" style={{ marginLeft: 8 }} type="button" onClick={() => { setSearchValue(''); setFilter(''); }}>Clear</button>
        <button
          className="btn-primary"
          type="button"
          style={{ float: 'right', marginLeft: 'auto' }}
          onClick={() => navigate('/freelancers/new')}
          data-testid="create-freelancer"
        >
          Create Freelancer
        </button>
      </form>
      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : freelancers.length === 0 ? (
        <div className="empty-state" data-testid="freelancer-empty">No freelancers found.</div>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none', margin: 0 }} data-testid="freelancer-list">
          {freelancers.map(f => (
            <li
              style={{
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                borderRadius: '10px',
                padding: '1.2rem',
                marginBottom: '1.3rem',
                background: 'var(--bg-white)',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
              }}
              key={f.id}
              data-testid={`freelancer-item-${f.id}`}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem', display: 'block' }}>{f.name}</span>
                <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.97rem' }}>
                  Skills:{' '}
                  {f.skills ? f.skills.split(',').map((skill, i) => (
                    <span key={i} style={tagColor}>{skill.trim()}</span>
                  )) : <span>No skills</span>}
                </span>
                <div style={{ color: 'var(--text-primary)', marginTop: '0.2em' }}>Hourly Rate: <strong>${f.hourlyRate}</strong></div>
              </div>
              <button
                className="btn-primary"
                style={{ minWidth: 130 }}
                onClick={() => navigate(`/freelancers/${f.id}`)}
                data-testid={`view-profile-${f.id}`}
              >
                View Profile
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FreelancerList;
