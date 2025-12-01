import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';

test('login submits and calls context login', async () => {
  const loginMock = jest.fn().mockResolvedValue({ token: 'abc' });
  const { getByText, getByLabelText } = render(
    <AuthContext.Provider value={{ login: loginMock }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  fireEvent.change(getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
  fireEvent.change(getByLabelText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(getByText(/Login/i));

  await waitFor(() => expect(loginMock).toHaveBeenCalledWith('user@example.com', 'password'));
});
