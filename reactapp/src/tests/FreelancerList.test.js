import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../api';
import FreelancerList from '../components/FreelancerList';

jest.mock('../api');

const mockFreelancers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    skills: 'Java, Spring Boot, React',
    hourlyRate: 35.0,
    bio: 'Experienced full-stack developer with 3 years of experience',
    joinedDate: '2023-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    skills: 'Python, Django, React',
    hourlyRate: 45.0,
    bio: '',
    joinedDate: '2023-03-10',
  },
];

describe('FreelancerList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithRouter(ui) {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  }

  test('State_renders list of freelancers', async () => {
    api.getAllFreelancers.mockResolvedValueOnce(mockFreelancers);
    renderWithRouter(<FreelancerList />);
    await screen.findByTestId('freelancer-list');
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    // Use getAllByText for Skills:
    const skillsLabels = screen.getAllByText('Skills:');
    expect(skillsLabels.length).toBeGreaterThanOrEqual(2);
    // Use getAllByText for Hourly Rate:
    const rateLabels = screen.getAllByText('Hourly Rate:');
    expect(rateLabels.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('$35')).toBeInTheDocument();
    expect(screen.getByText('$45')).toBeInTheDocument();
  });

  test('State_shows empty state when no freelancers', async () => {
    api.getAllFreelancers.mockResolvedValueOnce([]);
    renderWithRouter(<FreelancerList />);
    await screen.findByTestId('freelancer-empty');
    expect(screen.getByText('No freelancers found.')).toBeInTheDocument();
  });

  test('Axios_filters by skill on search', async () => {
    api.getAllFreelancers.mockResolvedValueOnce(mockFreelancers);
    api.getFreelancersBySkill.mockResolvedValueOnce([mockFreelancers[0]]);
    renderWithRouter(<FreelancerList />);
    await screen.findByTestId('freelancer-list');
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Java' } });
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => expect(api.getFreelancersBySkill).toHaveBeenCalledWith('Java'));
    // More robust: use findByText for async rerender
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  test('Routes_navigates to /freelancers/new on Create Freelancer', async () => {
    api.getAllFreelancers.mockResolvedValueOnce(mockFreelancers);
    renderWithRouter(<FreelancerList />);
    await screen.findByTestId('freelancer-list');
    const button = screen.getByTestId('create-freelancer');
    expect(button).toBeInTheDocument();
  });
});
