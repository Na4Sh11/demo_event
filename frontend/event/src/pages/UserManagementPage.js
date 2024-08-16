// UserManagementPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from '../components/UserList';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleViewUser = (id) => {
    // Handle view user logic
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/users/${id}`);
      const response = await axios.get('http://localhost:5001/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <UserList users={users} onViewUser={handleViewUser} onDeleteUser={handleDeleteUser} />
    </div>
  );
};

export default UserManagementPage;
