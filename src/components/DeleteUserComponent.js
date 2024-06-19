import { useState } from 'react';

export default function DeleteUserComponent() {
  const [userId, setUserId] = useState('');

  const handleDeleteUser = async () => {
    const response = await fetch('/api/deleteUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }), // userIdをJSON文字列に変換して送信
    });

    const data = await response.json();
    if (response.ok) {
      console.log('User deleted successfully:', data.message);
    } else {
      console.error('Failed to delete user:', data.error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleDeleteUser}>Delete User</button>
    </div>
  );
}
// Compare this snippet from src/pages/index.js: