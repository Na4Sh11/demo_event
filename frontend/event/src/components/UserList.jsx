// UserList.js
import React from 'react';

const UserList = ({ users, onViewUser, onDeleteUser }) => {
  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => onViewUser(user.id)}>View</button>
            <button onClick={() => onDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
