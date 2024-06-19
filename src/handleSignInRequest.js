export async function handleSignInRequest(email, password) {
  console.log("Starting sign-in process with email:", email);
  if (!email || !password) {
    console.log("Email or password missing");
    return { error: 'Email and password are required' };
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    console.log("Invalid email format");
    return { error: 'Invalid email format' };
  }
  if (/\s/.test(password)) {
    console.log("Password contains whitespace");
    return { error: 'Password must not contain whitespace' };
  }
  if (email.length > 255 || password.length > 255) {
    console.log("Email or password exceeds maximum length");
    return { error: 'Email and password must not exceed 255 characters' };
  }
  if (/[!#$%&'*+/=?^_`{|}~]/.test(email)) {
    console.log("Email contains invalid characters");
    return { error: 'Email contains invalid characters' };
  }

  try {
    console.log("Sending request to server");
    const response = await fetch('https://api.example.com/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log("Server response:", data);
    if (response.ok) {
      return { data };
    }
    return { error: data.error || 'Server error' };
  } catch (error) {
    console.error("Error during sign-in process:", error);
    return { error: 'Server error' };
  }
}
