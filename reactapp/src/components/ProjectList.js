import React, { useEffect, useState } from 'react';
import { getAllProjects, getProjectsByStatus } from '../api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const statusStyles = {
  OPEN: { background: '#e0f2fe', color: '#2563eb' },
  IN_PROGRESS: { background: '#fef08a', color: '#b45309' },
  COMPLETED: { background: '#d1fae5', color: '#047857' },
};

const statusOrder = ['OPEN', 'IN_PROGRESS', 'COMPLETED'];

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const prom = filter === 'ALL' ? getAllProjects() : getProjectsByStatus(filter);
    prom
      .then(setProjects)
      .catch(e => setError(e.message || 'Failed to fetch'))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="container">
      <h2 className="page-title">Projects</h2>
      <div className="project-filters" style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button
          type="button"
          className={filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}
          data-testid="filter-all"
          onClick={() => setFilter('ALL')}>All</button>
        {statusOrder.map(status => (
          <button
            type="button"
            key={status}
            className={filter === status ? 'btn-primary' : 'btn-secondary'}
            data-testid={`filter-${status.toLowerCase()}`}
            onClick={() => setFilter(status)}>{status.replace('_', ' ')}</button>
        ))}
        <button
          className="btn-primary"
          type="button"
          style={{ marginLeft: 'auto' }}
          data-testid="post-project"
          onClick={() => navigate('/projects/new')}
        >Post Project</button>
      </div>
      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : projects.length === 0 ? (
        <div className="empty-state" data-testid="project-empty">No projects available.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} data-testid="project-list">
          {projects.map(p => (
            <li key={p.id} style={{ boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.3rem', background: 'var(--bg-white)', display: 'flex', alignItems: 'center', gap: '2rem' }} data-testid={`project-item-${p.id}`}>
              <div style={{ flex: 1, maxWidth: '70%' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem', display: 'block' }}>{p.title}</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Client: {p.clientName}</div>
                <div style={{ color: 'var(--text-primary)', margin: '0.3em 0' }}>Budget: <strong>${p.budget}</strong></div>
                <span style={{
                  ...statusStyles[(p.status || '').toUpperCase()] || {},
                  padding: '0.25em 0.65em',
                  borderRadius: 7,
                  marginRight: 8,
                  fontWeight: 600,
                  fontSize: '0.95em',
                  display: 'inline-block',
                  letterSpacing: '0.04em',
                }}>
                  {p.status}
                </span>
              </div>
              <button
                className="btn-primary"
                style={{ minWidth: 120 }}
                onClick={() => navigate(`/projects/${p.id}`)}
                data-testid={`view-details-${p.id}`}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProjectList;
