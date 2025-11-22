import { useState } from "react";

function EditUserForm({ user, onUpdate }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    company: user.company?.name || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onUpdate({
      ...user,
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: { name: form.company }
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>

      <label style={labelStyle}>Name:</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        style={inputStyle}
      />

      <label style={labelStyle}>Email:</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        style={inputStyle}
      />

      <label style={labelStyle}>Phone:</label>
      <input
        type="text"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        style={inputStyle}
      />

      <label style={labelStyle}>Company Name:</label>
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={handleChange}
        style={inputStyle}
      />

      <button type="submit" style={btnStyle}>Update User</button>
    </form>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const labelStyle = {
  fontWeight: "bold",
  fontSize: "14px",
  color: "#333"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

const btnStyle = {
  background: "#28a745",
  color: "white",
  padding: "10px",
  marginTop: "10px",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
  fontSize: "16px"
};

export default EditUserForm;
