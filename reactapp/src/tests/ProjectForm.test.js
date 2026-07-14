import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../api';
import ProjectForm from '../components/ProjectForm';

jest.mock('../api');

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('ProjectForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('State_shows field errors for empty fields', async () => {
    renderWithRouter(<ProjectForm />);
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('deadline-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('clientName-input'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Budget must be positive')).toBeInTheDocument();
    expect(screen.getByText('Deadline is required')).toBeInTheDocument();
    expect(screen.getByText('Client Name is required')).toBeInTheDocument();
  });
  test('State_shows field errors for invalid budget and deadline', async () => {
    renderWithRouter(<ProjectForm />);
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Project 1' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: -77 } });
    fireEvent.change(screen.getByTestId('deadline-input'), { target: { value: '2020-01-01' } });
    fireEvent.change(screen.getByTestId('clientName-input'), { target: { value: 'Bayer' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText('Budget must be positive')).toBeInTheDocument();
    expect(screen.getByText('Deadline must be in the future')).toBeInTheDocument();
  });
  test('Axios_on successful submission, displays success and clears form', async () => {
    api.createProject.mockResolvedValueOnce({ id: 11, title: 'Build X', status: 'OPEN' });
    renderWithRouter(<ProjectForm />);
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Build X' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Top Secret' } });
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: 1500 } });
    // deadline: set far-future (ensures always future for test)
    fireEvent.change(screen.getByTestId('deadline-input'), { target: { value: '2099-12-28' } });
    fireEvent.change(screen.getByTestId('clientName-input'), { target: { value: 'GigaTech' } });
    fireEvent.click(screen.getByText('Submit'));
    await screen.findByTestId('success-msg');
    expect(screen.getByTestId('title-input')).toHaveValue('');
    expect(screen.getByTestId('budget-input')).toHaveValue(null);
  });
  test('State_shows api validation errors from backend', async () => {
    api.createProject.mockRejectedValueOnce({
      message: 'Validation failed',
      errors: ['Deadline not in future', 'Budget too low'],
    });
    renderWithRouter(<ProjectForm />);
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Y' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'test' } });
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: 100 } });
    fireEvent.change(screen.getByTestId('deadline-input'), { target: { value: '2099-08-01' } });
    fireEvent.change(screen.getByTestId('clientName-input'), { target: { value: 'AA' } });
    fireEvent.click(screen.getByText('Submit'));
    await screen.findByTestId('api-errors');
    expect(screen.getByText('Deadline not in future')).toBeInTheDocument();
    expect(screen.getByText('Budget too low')).toBeInTheDocument();
  });
});
