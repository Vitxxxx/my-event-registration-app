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
      window.alert('Пользователь успешно добавлен!');
      setFormData({
        name: '',
        email: '',
        age: '',
      });
    } catch (error) {
      window.alert('Ошибка при добавлении пользователя: ' + error.message);
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
      window.alert('Пользователь успешно удален!');
    } catch (error) {
      window.alert('Ошибка при удалении пользователя: ' + error.message);
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
      window.alert('Пользователь успешно обновлен!');
    } catch (error) {
      window.alert('Ошибка при обновлении пользователя: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Регистрационная форма</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Имя и фамилия"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Электронная почта"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          placeholder="Возраст"
          onChange={handleChange}
          required
        />
        <button type="submit">Добавить пользователя</button>
      </form>

      <h1>Список зарегистрированных пользователей</h1>
      <table>
        <thead>
          <tr>
            <th>Имя и фамилия</th>
            <th>Электронная почта</th>
            <th>Возраст</th>
            <th>Дата рождения</th>
            <th>Действия</th>
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
                <button onClick={() => handleEdit(user)}>Изменить</button>
                <button onClick={() => handleDelete(user._id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div>
          <h2>Редактирование пользователя</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Имя и фамилия"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Электронная почта"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="age"
              value={formData.age}
              placeholder="Возраст"
              onChange={handleChange}
              required
            />
            <button type="submit">Обновить пользователя</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
