import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../api';
import ProjectList from '../components/ProjectList';

jest.mock('../api');

const mockProjects = [
  {
    id: 1,
    title: 'E-commerce Website Development',
    description: 'Develop a full-stack website',
    budget: 5000.0,
    deadline: '2023-12-31',
    clientName: 'ABC Company',
    status: 'OPEN',
    createdDate: '2023-06-01',
    assignedFreelancer: null
  },
  {
    id: 2,
    title: 'Data Analytics Platform',
    description: 'Setup analytics infra',
    budget: 3500.0,
    deadline: '2023-09-01',
    clientName: 'XYZ Ltd',
    status: 'IN_PROGRESS',
    createdDate: '2023-05-15',
    assignedFreelancer: null
  },
  {
    id: 3,
    title: 'Mobile App Testing',
    description: 'QA for mobile',
    budget: 1000.0,
    deadline: '2023-08-15',
    clientName: 'MobiSoft',
    status: 'COMPLETED',
    createdDate: '2023-04-01',
    assignedFreelancer: null
  },
];

describe('ProjectList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  function renderWithRouter(Ui) {
    return render(<BrowserRouter>{Ui}</BrowserRouter>);
  }

  test('State_renders all project cards', async () => {
    api.getAllProjects.mockResolvedValueOnce(mockProjects);
    renderWithRouter(<ProjectList />);
    await screen.findByTestId('project-list');
    expect(screen.getByText('E-commerce Website Development')).toBeInTheDocument();
    expect(screen.getByText('Data Analytics Platform')).toBeInTheDocument();
    expect(screen.getByText('Mobile App Testing')).toBeInTheDocument();
    expect(screen.getByText('Client: ABC Company')).toBeInTheDocument();
    // Budget: $X checking
    expect(screen.getAllByText((content, node) => node.textContent === 'Budget: $5000').length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, node) => node.textContent === 'Budget: $3500').length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, node) => node.textContent === 'Budget: $1000').length).toBeGreaterThan(0);
    // Use getAllByText for status, nonzero
    expect(screen.getAllByText('OPEN').length).toBeGreaterThan(0);
    expect(screen.getAllByText('IN_PROGRESS').length).toBeGreaterThan(0);
    expect(screen.getAllByText('COMPLETED').length).toBeGreaterThan(0);
  });

  test('Axios_filters by status when clicking filter', async () => {
    api.getAllProjects.mockResolvedValueOnce(mockProjects);
    api.getProjectsByStatus.mockResolvedValueOnce([mockProjects[1]]); // in progress
    renderWithRouter(<ProjectList />);
    await screen.findByTestId('project-list');
    fireEvent.click(screen.getByTestId('filter-in_progress'));
    await waitFor(() => expect(api.getProjectsByStatus).toHaveBeenCalledWith('IN_PROGRESS'));
    expect(await screen.findByText('Data Analytics Platform')).toBeInTheDocument();
    expect(screen.queryByText('E-commerce Website Development')).not.toBeInTheDocument();
    expect(screen.queryByText('Mobile App Testing')).not.toBeInTheDocument();
  });
  
  test('State_shows empty state if no projects', async () => {
    api.getAllProjects.mockResolvedValueOnce([]);
    renderWithRouter(<ProjectList />);
    await screen.findByTestId('project-empty');
    expect(screen.getByText('No projects available.')).toBeInTheDocument();
  });

  test('State_Post Project button present', async () => {
    api.getAllProjects.mockResolvedValueOnce(mockProjects);
    renderWithRouter(<ProjectList />);
    await screen.findByTestId('project-list');
    const btn = screen.getByTestId('post-project');
    expect(btn).toBeInTheDocument();
  });
});
