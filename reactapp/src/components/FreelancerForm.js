import React, { useState } from 'react';
import { createFreelancer } from '../api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function validateForm({ name, email, skills, hourlyRate }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Invalid email format';
  if (!skills.trim()) errors.skills = 'Skills are required';
  if (!hourlyRate || isNaN(hourlyRate) || Number(hourlyRate) <= 0) errors.hourlyRate = 'Hourly rate must be positive';
  return errors;
}

function getToday() {
  // returns YYYY-MM-DD
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function FreelancerForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    skills: '',
    hourlyRate: '',
    bio: '',
    joinedDate: getToday(),
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
    const fieldErrors = validateForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setLoading(true);
    try {
      await createFreelancer({ ...form, hourlyRate: Number(form.hourlyRate) });
      setSuccess(true);
      setForm({ name: '', email: '', skills: '', hourlyRate: '', bio: '', joinedDate: getToday() });
    } catch (err) {
      setApiErrors(err.errors ? err.errors : [err.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="page-title">Create Freelancer</h2>
      <form onSubmit={onSubmit} data-testid="freelancer-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            className={errors.name ? 'error' : ''}
            data-testid="name-input"
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className={errors.email ? 'error' : ''}
            data-testid="email-input"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <input
            id="skills"
            name="skills"
            value={form.skills}
            onChange={onChange}
            className={errors.skills ? 'error' : ''}
            data-testid="skills-input"
          />
          {errors.skills && <div className="error">{errors.skills}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="hourlyRate">Hourly Rate</label>
          <input
            id="hourlyRate"
            name="hourlyRate"
            type="number"
            value={form.hourlyRate}
            step="0.01"
            min="0"
            onChange={onChange}
            className={errors.hourlyRate ? 'error' : ''}
            data-testid="hourlyRate-input"
          />
          {errors.hourlyRate && <div className="error">{errors.hourlyRate}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={onChange}
            style={{ minHeight: 60 }}
            data-testid="bio-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="joinedDate">Joined Date</label>
          <input
            id="joinedDate"
            name="joinedDate"
            type="date"
            value={form.joinedDate}
            onChange={onChange}
            max={getToday()}
            data-testid="joinedDate-input"
          />
        </div>
        {apiErrors.length > 0 && (
          <div className="error" data-testid="api-errors">
            {apiErrors.map((e, idx) => (<div key={idx}>{e}</div>))}
          </div>
        )}
        {success && <div className="success" data-testid="success-msg">Freelancer created successfully!</div>}
        <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: 16 }}>
          <button type="submit" className="btn-primary" disabled={loading}>Submit</button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/freelancers')}
            disabled={loading}
          >Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default FreelancerForm;
