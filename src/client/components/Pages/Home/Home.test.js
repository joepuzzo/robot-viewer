import React from 'react';
import { Home } from './Home';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, waitFor, screen } from '@testing-library/react';

// ---------- Example mock a hook ----------
jest.mock('../../../hooks/useAuth', () => {
  return jest.fn(() => {
    return {
      user: {
        name: 'Elon',
      },
    };
  });
});

// ---------- Example mock a rest call ----------

const server = setupServer(
  rest.get('/health', (req, res, ctx) => {
    return res(ctx.json({ status: 'UP' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Home', () => {
  it('Renders loader when call is occurring', async () => {
    render(<Home />);
    await waitFor(() => screen.getByRole('alert', { name: /loading/ }));
    await waitFor(() => screen.getByText(/Hello/));
  });

  it('Renders data when call succeeds', async () => {
    render(<Home />);
    await waitFor(() => screen.getByText(/Hello/));
    expect(screen.getByText('Hello Elon!')).toBeInTheDocument();
    expect(screen.getByText('Health Check UP')).toBeInTheDocument();
  });

  it('Renders data when call fails', async () => {
    server.use(
      rest.get('/health', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Home />);
    await waitFor(() => screen.getByText(/Request failed with status code 500/));
  });
});
