import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { AuthContext } from '../context/AuthContext';

test('register calls context register', async () => {
  const registerMock = jest.fn().mockResolvedValue({ id: 1 });
  const { getByText, getByLabelText } = render(
    <AuthContext.Provider value={{ register: registerMock }}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  fireEvent.change(getByLabelText(/Full Name/i), { target: { value: 'User' } });
  fireEvent.change(getByLabelText(/^Email$/i), { target: { value: 'user@example.com' } });
  fireEvent.change(getByLabelText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(getByText(/Create account/i));

  await waitFor(() => expect(registerMock).toHaveBeenCalled());
});
