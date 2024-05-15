import React, { useState, useEffect } from 'react';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
  });
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      window.alert('Error fetching users: ' + error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      fetchUsers();
      window.alert('User successfully added!');
      setFormData({
        name: '',
        email: '',
        age: '',
      });
    } catch (error) {
      window.alert('Error adding user: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      fetchUsers();
      window.alert('User successfully deleted!');
    } catch (error) {
      window.alert('Error deleting user: ' + error.message);
    }
  };

  const calculateDateOfBirth = (age) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear() - age;
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    return new Date(year, month, day).toLocaleDateString();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      age: user.age || '',
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${editingUser._id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      fetchUsers();
      window.alert('User successfully updated!');
    } catch (error) {
      window.alert('Error updating user: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Name and Surname"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          placeholder="Age"
          onChange={handleChange}
          required
        />
        <button type="submit">Add User</button>
      </form>

      <h1>List of Registered Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name and Surname</th>
            <th>Email</th>
            <th>Age</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{calculateDateOfBirth(user.age)}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div>
          <h2>Edit User</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name and Surname"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="age"
              value={formData.age}
              placeholder="Age"
              onChange={handleChange}
              required
            />
            <button type="submit">Update User</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
