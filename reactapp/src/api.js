// API utility for the Freelance Marketplace frontend (uses fetch, not axios)
// Backend base URL
const BASE_URL = 'http://localhost:8080/api';

// Helper to handle responses
async function handleResponse(response) {
  const contentType = response.headers.get('Content-Type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  if (!response.ok) {
    const err = (data && data.message) ? { message: data.message, errors: data.errors || null } : { message: data };
    throw err;
  }
  return data;
}

// Freelancers
export async function getAllFreelancers() {
  const res = await fetch(`${BASE_URL}/freelancers`);
  return handleResponse(res);
}

export async function getFreelancersBySkill(skill) {
  const res = await fetch(`${BASE_URL}/freelancers/skill/${encodeURIComponent(skill)}`);
  return handleResponse(res);
}

export async function createFreelancer({ name, email, skills, hourlyRate, bio, joinedDate }) {
  const res = await fetch(`${BASE_URL}/freelancers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, skills, hourlyRate, bio, joinedDate }),
  });
  return handleResponse(res);
}

export async function getFreelancerById(id) {
  const res = await fetch(`${BASE_URL}/freelancers/${id}`);
  return handleResponse(res);
}

// Projects
export async function getAllProjects() {
  const res = await fetch(`${BASE_URL}/projects`);
  return handleResponse(res);
}

export async function getProjectsByStatus(status) {
  const res = await fetch(`${BASE_URL}/projects/status/${encodeURIComponent(status)}`);
  return handleResponse(res);
}

export async function createProject({ title, description, budget, deadline, clientName, status, createdDate }) {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, budget, deadline, clientName, status, createdDate }),
  });
  return handleResponse(res);
}

export async function getProjectById(id) {
  const res = await fetch(`${BASE_URL}/projects/${id}`);
  return handleResponse(res);
}

export async function assignFreelancerToProject(projectId, freelancerId) {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/assign/${freelancerId}`, {
    method: 'PUT',
  });
  return handleResponse(res);
}
