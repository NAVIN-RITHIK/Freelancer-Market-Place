import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import FreelancerList from './components/FreelancerList';
import FreelancerForm from './components/FreelancerForm';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';

function Home() {
  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <h2>Welcome to the Freelance Marketplace!</h2>
      <p style={{ color: 'var(--text-muted)', margin: '2.5rem 0 1.5rem 0' }}>
        <strong>Post projects, find top freelancers, and collaborate with ease.</strong>
      </p>
      <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
        <a href="/freelancers" className="btn-primary" style={{ minWidth: '160px' }}>Browse Freelancers</a>
        <a href="/projects" className="btn-primary" style={{ minWidth: '160px' }}>Browse Projects</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/freelancers" element={<FreelancerList />} />
        <Route path="/freelancers/new" element={<FreelancerForm />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
