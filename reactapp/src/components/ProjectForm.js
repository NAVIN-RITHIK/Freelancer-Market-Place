import React, { useState } from 'react';
import { createProject } from '../api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  if (!form.description.trim()) errors.description = 'Description is required';
  if (!form.budget || isNaN(form.budget) || Number(form.budget) <= 0) errors.budget = 'Budget must be positive';
  if (!form.deadline) errors.deadline = 'Deadline is required';
  else if (new Date(form.deadline) <= new Date()) errors.deadline = 'Deadline must be in the future';
  if (!form.clientName.trim()) errors.clientName = 'Client Name is required';
  return errors;
}

function getTodayPlus(days=0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function ProjectForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    clientName: '',
    status: 'OPEN',
    createdDate: getTodayPlus(0),
  });
  const [errors, setErrors] = useState({});
  const [apiErrors, setApiErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setApiErrors([]);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setSuccess(false);
    setApiErrors([]);
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setLoading(true);
    try {
      await createProject({ ...form, budget: Number(form.budget) });
      setSuccess(true);
      setForm({ title: '', description: '', budget: '', deadline: '', clientName: '', status: 'OPEN', createdDate: getTodayPlus(0) });
    } catch (err) {
      setApiErrors(err.errors ? err.errors : [err.message]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="form-container">
      <h2 className="page-title">Post a Project</h2>
      <form onSubmit={onSubmit} data-testid="project-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" data-testid="title-input" value={form.title} onChange={onChange} className={errors.title ? 'error' : ''} />
          {errors.title && <div className="error">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" data-testid="description-input" value={form.description} onChange={onChange} className={errors.description ? 'error' : ''} style={{ minHeight: 60 }} />
          {errors.description && <div className="error">{errors.description}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="budget">Budget</label>
          <input id="budget" name="budget" data-testid="budget-input" value={form.budget} onChange={onChange} className={errors.budget ? 'error' : ''} type="number" step="0.01" min="0" />
          {errors.budget && <div className="error">{errors.budget}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input id="deadline" name="deadline" data-testid="deadline-input" value={form.deadline} onChange={onChange} type="date" className={errors.deadline ? 'error' : ''} min={getTodayPlus(1)} />
          {errors.deadline && <div className="error">{errors.deadline}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="clientName">Client Name</label>
          <input id="clientName" name="clientName" data-testid="clientName-input" value={form.clientName} onChange={onChange} className={errors.clientName ? 'error' : ''} />
          {errors.clientName && <div className="error">{errors.clientName}</div>}
        </div>
        {/* status and createdDate are hidden but sent in payload */}
        {apiErrors.length > 0 && (
          <div className="error" data-testid="api-errors">
            {apiErrors.map((e, idx) => (<div key={idx}>{e}</div>))}
          </div>
        )}
        {success && <div className="success" data-testid="success-msg">Project posted successfully!</div>}
        <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: 16 }}>
          <button type="submit" className="btn-primary" disabled={loading}>Submit</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/projects')} disabled={loading}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;
