import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../api';
import FreelancerForm from '../components/FreelancerForm';

jest.mock('../api');

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}
describe('FreelancerForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('State_renders all fields and validates required input', async () => {
    renderWithRouter(<FreelancerForm />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: '' }});
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: '' }});
    fireEvent.change(screen.getByTestId('skills-input'), { target: { value: '' }});
    fireEvent.change(screen.getByTestId('hourlyRate-input'), { target: { value: '' }});
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Skills are required')).toBeInTheDocument();
    expect(screen.getByText('Hourly rate must be positive')).toBeInTheDocument();
  });
  test('State_shows error for invalid email format and negative rate', async () => {
    renderWithRouter(<FreelancerForm />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John' }});
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'foo@bar' }});
    fireEvent.change(screen.getByTestId('skills-input'), { target: { value: 'React' }});
    fireEvent.change(screen.getByTestId('hourlyRate-input'), { target: { value: -5 }});
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
    expect(screen.getByText('Hourly rate must be positive')).toBeInTheDocument();
  });
  test('Axios_on successful submission, displays success and clears form', async () => {
    api.createFreelancer.mockResolvedValueOnce({ id: 7, name: 'Mary', email: 'mary@example.com' });
    renderWithRouter(<FreelancerForm />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Mary' }});
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'mary@example.com' }});
    fireEvent.change(screen.getByTestId('skills-input'), { target: { value: 'Python' }});
    fireEvent.change(screen.getByTestId('hourlyRate-input'), { target: { value: 13 }});
    fireEvent.click(screen.getByText('Submit'));
    await screen.findByTestId('success-msg');
    // Name/email after submit cleared
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('email-input')).toHaveValue('');
    expect(screen.getByTestId('skills-input')).toHaveValue('');
    expect(screen.getByTestId('hourlyRate-input')).toHaveValue(null);
  });
  test('ErrorHandling_displays api validation errors from backend', async () => {
    api.createFreelancer.mockRejectedValueOnce({
      message: 'Validation failed',
      errors: ['Email already in use', 'Invalid skills list'],
    });
    renderWithRouter(<FreelancerForm />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Bob' }});
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'bob@example.com' }});
    fireEvent.change(screen.getByTestId('skills-input'), { target: { value: 'C++' }});
    fireEvent.change(screen.getByTestId('hourlyRate-input'), { target: { value: 15 }});
    fireEvent.click(screen.getByText('Submit'));
    await screen.findByTestId('api-errors');
    expect(screen.getByText('Email already in use')).toBeInTheDocument();
    expect(screen.getByText('Invalid skills list')).toBeInTheDocument();
  });
});
