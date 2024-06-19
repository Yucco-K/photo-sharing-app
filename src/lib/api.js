// lib/api.js

export async function handleSignInRequest(email, password) {
  try {
    const response = await fetch('/api/signinUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign in');
    }

    return { data };
  } catch (error) {
    console.error('Error signing in:', error.message);
    return { error };
  }
}
