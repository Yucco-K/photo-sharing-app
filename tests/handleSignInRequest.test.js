import { handleSignInRequest } from '../src/handleSignInRequest';

// Jestでfetchをモックする
const responseMock = { ok: true };
const fetchMock = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve(responseMock)
});
global.fetch = fetchMock;

test('Successful sign in', async () => {
  const result = await handleSignInRequest('test@example.com', 'password');
  expect(result).toEqual({ data: responseMock });
});

test('Sign in with incorrect credentials', async () => {
  const errorResponseMock = { ok: false, error: 'Invalid credentials' };
  fetchMock.mockResolvedValueOnce({
    ok: false,
    json: () => Promise.resolve(errorResponseMock)
  });

  const result = await handleSignInRequest('test@example.com', 'wrongpassword');
  expect(result).toEqual({ error: 'Invalid credentials' });
});

test('Sign in with empty email and password', async () => {
  const result = await handleSignInRequest('', '');
  expect(result).toEqual({ error: 'Email and password are required' });
});

test('Sign in with server error', async () => {
  fetchMock.mockRejectedValueOnce(new Error('Server error'));

  const result = await handleSignInRequest('test@example.com', 'password');
  expect(result).toEqual({ error: 'Server error' });
});
