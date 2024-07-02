import React, { useState } from 'react';

const DeleteUserComponent = () => {
  const [userId, setUserId] = useState('');

  const handleDeleteUser = async () => {
    try {
      const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Error deleting user: ${error.message}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
      />
      <button onClick={handleDeleteUser}>Delete User</button>
    </div>
  );
};

export default DeleteUserComponent;
// Compare this snippet from src/pages/index.js: