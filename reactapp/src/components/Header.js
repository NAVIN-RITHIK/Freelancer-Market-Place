import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Header() {
  const { pathname } = useLocation();
  return (
    <nav className="main-nav">
      <Link to="/" className="brand">Freelance Marketplace</Link>
      <div style={{ flex: 1 }} />
      <Link to="/freelancers" className={pathname.startsWith('/freelancers') ? 'nav-link active' : 'nav-link'} data-testid="nav-freelancers">Freelancers</Link>
      <Link to="/projects" className={pathname.startsWith('/projects') ? 'nav-link active' : 'nav-link'} data-testid="nav-projects">Projects</Link>
    </nav>
  );
}
export default Header;
