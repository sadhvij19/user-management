import React, { useState, useEffect } from 'react';
import styles from './UsersTable.module.css';
import { FaPlus, FaSearch } from 'react-icons/fa';
import Modal from './common/Modal'; 
import AddUserForm from './AddUserForm'; 
// We assume EditUserForm is also available for the edit function
import EditUserForm from './EditUserForm'; 
import { getUsers, createUser, deleteUser, updateUser } from '../services/userService';

const UsersTable = () => { 
  // --- Data and Loading States ---
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- UI and Modal States ---
  const [isPressed, setIsPressed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null); 

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Showing 10 users per page

  // --- Data Fetching on Mount ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getUsers();
        setUsers(data); 
        setError(null);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load users. Please check the network connection.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // --- Modal Handlers ---
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // --- Pagination Logic (Client-Side) ---
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
  }

  // --- Add User Handler (FIXED error handling) ---
  const handleAddUser = async (newUserData) => {
    try {
      const createdUser = await createUser(newUserData); 
      setUsers([createdUser, ...users]); 
      handleCloseModal();
      console.log('User created successfully:', createdUser.name); 

    } catch (err) {
      console.error("User Creation failed:", err);
      // Removed alert(), using console for non-blocking feedback
      setError("Failed to create user. See console for details.");
    }
  };
  
  // --- Delete User Handler (FIXED) ---
  const handleDelete = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete user ID ${userId}?`)) {
        return;
    }
    
    try {
        await deleteUser(userId); // Simulate API deletion
        
        // Update client state
        setUsers(users.filter(user => user.id !== userId));
        
        // Reset page if the current page becomes empty
        if (currentUsers.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        
    } catch (error) {
        console.error("Delete failed:", error);
        setError("Delete failed. Check console for details.");
    }
  };
  
  // --- Edit Handlers (IMPLEMENTED) ---
  const handleEdit = (user) => {
      setUserToEdit(user);
      setIsEditModalOpen(true);
  };
  
  const handleUpdateUser = async (updatedData) => {
      try {
          const response = await updateUser(userToEdit.id, updatedData);
          
          // Update client state with the new data
          setUsers(users.map(user => 
              user.id === userToEdit.id ? { ...user, ...updatedData, company: response.company || user.company } : user
          ));
          
          setIsEditModalOpen(false);
          setUserToEdit(null);

      } catch (error) {
          console.error("Update failed:", error);
          setError("Update failed. Check console for details.");
      }
  };


  // --- Conditional Rendering ---
  if (isLoading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  // --- JSX Rendering ---
  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
            <h1>User Management System</h1>
        </header>
        
        {/* Error Notification */}
        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* Controls Section */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search by name or email..." />
          </div>
          
          <button 
            className={styles.btnAddUser} 
            onClick={handleOpenModal} 
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            style={{ transform: isPressed ? 'scale(0.98)' : 'scale(1)' }}
          >
            <FaPlus /> Add User
          </button>
        </div>

        {/* --- Table Card --- */}
        <div className={styles.tableCard}>
            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => ( // <-- Using currentUsers for pagination
                      <tr 
                        key={user.id} 
                        className={styles.userRow}
                        style={{ '--row-delay': `${0.1 * index}s` }} 
                      >
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        {/* Ensure company name access is safe */}
                        <td>{user.company?.name || user.company || 'N/A'}</td>
                        <td className={styles.actions}>
                          <button 
                            className={styles.btnEdit} 
                            onClick={() => handleEdit(user)} // <-- Edit Handler
                          >
                            Edit
                          </button>
                          <button 
                            className={styles.btnDelete}
                            onClick={() => handleDelete(user.id)} // <-- Delete Handler
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentUsers.length === 0 && (
                        <tr><td colSpan="5" className={styles.noData}>No users found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
        
        {/* Pagination (FIXED and dynamic) */}
        {totalPages > 1 && (
            <div className={styles.pagination}>
                <button 
                    className={styles.pageBtn} 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                
                {pageNumbers.map(number => (
                    <button 
                        key={number}
                        onClick={() => paginate(number)} 
                        className={`${styles.pageBtn} ${currentPage === number ? styles.active : ''}`}
                    >
                        {number}
                    </button>
                ))}

                <button 
                    className={styles.pageBtn} 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        )}

      </div>
      
      {/* 5. The Animated Add Modal Component */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Create New User"
      >
        <AddUserForm 
          onAdd={handleAddUser} 
          onCancel={handleCloseModal} 
        />
      </Modal>

      {/* 6. The Edit Modal Component */}
      {userToEdit && (
          <Modal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            title={`Edit ${userToEdit.name}`}
          >
            {/* Pass current data to the form */}
            <EditUserForm 
                user={userToEdit}
                onUpdate={handleUpdateUser} 
                onCancel={() => setIsEditModalOpen(false)}
            />
          </Modal>
      )}
    </>
  );
};

export default UsersTable;