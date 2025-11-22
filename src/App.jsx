import React, { useEffect, useState } from "react";
import UsersTable from "./components/UsersTable.jsx";
import Modal from "./components/common/Modal.jsx";

import AddUserForm from "./components/AddUserForm.jsx";
import EditUserForm from "./components/EditUserForm.jsx";
import Toast from "./components/common/Toast.jsx";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);

  // For editing user
  const [editUser, setEditUser] = useState(null);

  // ------------------------------
  // TOAST STATE
  // ------------------------------
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // ------------------------------
  // PAGINATION STATE (NEW)
  // ------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Fetch API users
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Add user
  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, id: Date.now() }]);
    setShowAddModal(false);
    showToast("User added successfully!", "success");
  };

  // Edit: open modal
  const handleEdit = (user) => {
    setEditUser(user);
  };

  // Update user
  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditUser(null);
    showToast("User updated successfully!", "info");
  };

  // Delete user
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
      showToast("User deleted!", "error");
    }
  };

  // --- SEARCH AND FILTERING LOGIC ---
  
  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter the users based on the search term (used for table data and pagination count)
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ------------------------------
  // PAGINATION LOGIC (NEW)
  // ------------------------------
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>

    

      {/* User Table */}
      <UsersTable
        users={currentUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />



      {/* Add User Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <AddUserForm onAdd={handleAddUser} />
        </Modal>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <Modal onClose={() => setEditUser(null)}>
          <EditUserForm user={editUser} onUpdate={handleUpdateUser} />
        </Modal>
      )}

      {/* TOAST */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}
