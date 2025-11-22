// src/components/AddUserForm.jsx

import React, { useState } from 'react';
import styles from './AddUserForm.module.css'; // Will create this next

const AddUserForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate here and call userService.addUser(formData)
    console.log('New User Data:', formData);
    onAdd(formData); // Pass data back to parent
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone</label>
        <input 
          type="tel" 
          id="phone" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="company">Company</label>
        <input 
          type="text" 
          id="company" 
          name="company" 
          value={formData.company} 
          onChange={handleChange} 
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnCancel} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.btnSubmit}>
          Create User
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;