import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import style from '../../all.module.css';
import {
  FaEdit,
  FaTrash,
  FaEllipsisH,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../../src/context/AuthProvider';
import { FaDownload } from 'react-icons/fa6';
import Modal from '../subscriptions/modal';
import ExportCsv from '@/src/popups/ExportCsv';

type User = {
  id: number;
  name: string;
  email: string;
  role_id: number;
  is_active: boolean;
  updated_at: string;
  created_at: string;
  first_login_at: string;
  profession: string;
  patients: number;
  lastLogin: string;
  selected_package: string;
};

const ManageUsers: React.FC = () => {
  const { loggedUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selUsers, setSelUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isExport, setisExport] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/users`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const fetchedUsers: User[] = Array.isArray(response.data.users)
          ? response.data.users
          : [];
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error: any) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // const handleDelete = async () => {
  //   if (window.confirm('Are you sure you want to delete the selected users?')) {
  //     setLoading(true);
  //     const token = localStorage.getItem('token');
  //     try {
  //       await Promise.all(
  //         selectedUsers.map(async (userId) => {
  //           await axios.delete(
  //             `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/users/${userId}`,
  //             {
  //               headers: {
  //                 Authorization: `${token}`,
  //               },
  //             }
  //           );
  //         })
  //       );
  //       setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
  //       setSelectedUsers([]);
  //     } catch (error: any) {
  //       setError('Failed to delete users.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete the selected users?')) {
      setLoading(true);
      const token = localStorage.getItem('token');
      const deletedUsers: typeof selectedUsers = []; // Array to store users before deletion
  
      try {
        // Loop through selected users, delete each, and add to deletedUsers
        for (const userId of selectedUsers) {
          try {
            await axios.delete(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/users/${userId}`,
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );
            deletedUsers.push(userId); // Add successfully deleted user to list
          } catch (error) {
            console.error(`Failed to delete user with ID ${userId}`, error);
          }
        }
  
        // Update state to remove deleted users
        setUsers(users.filter((user) => !deletedUsers.includes(user.id)));
        setSelectedUsers([]);
      } catch (error: any) {
        setError('Failed to delete one or more users.');
      } finally {
        setLoading(false);
      }
    }
  };
  

  const handleExport = () => {
    // setSelUsers(users.filter((user) => !selectedUsers.includes(user.id)));
    setisExport(true);
  }
  

  const toggleMenu = (userId: number) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const toggleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const singDelete = (userId: number) => {
    console.log(userId);
    setSelectedUsers([...selectedUsers, userId])
    setTimeout(() => {
      handleDelete()
    }, 3000);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={style.cardContainer}>
      <div className={` ${style.card} ${style.w100} `}>
        <div className={style.header}>
          <div>
            <span>Manage Users</span>
          </div>
          <div className={style.options}>
            {selectedUsers.length > 0 && (
              <div className='w-fit flex gap-5 items-center'>
                <button
                  className={`btn ${style.massDeleteButton}`}
                  onClick={handleDelete}
                >
                  <FaTrash /> Delete All
                </button>

                <button
                className={`btn ${style.massDeleteButton}`}
                onClick={handleExport}
              >
                <FaDownload /> Export
              </button>
              </div>
            )}
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={style.searchInput}
            />
          </div>
        </div>
        <div className={style.body}>
          <div className={style.tableContainer}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={() => {
                        const allUserIds = currentUsers.map((user) => user.id);
                        if (selectedUsers.length === allUserIds.length) {
                          setSelectedUsers([]);
                        } else {
                          setSelectedUsers(allUserIds);
                        }
                      }}
                      checked={selectedUsers.length === currentUsers.length}
                      className={style.checkbox}
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subscription</th>
                  <th>First Login</th>
                  <th>Member Since</th>
                  <th>Last Login</th>
                  <th>User Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={
                      Number(loggedUser?.id) === user.id
                        ? style.disabledRow
                        : ''
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => toggleSelectUser(user.id)}
                        checked={selectedUsers.includes(user.id)}
                        className={style.checkbox}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.selected_package}</td>
                    <td>{format(new Date(user.first_login_at), 'PPpp')}</td>
                    <td>{format(new Date(user.created_at), 'PPpp')}</td>
                    <td>
                      {formatDistanceToNow(new Date(user.updated_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td>
                      {user.role_id === 1
                        ? 'Administrator'
                        : user.role_id === 2
                          ? 'Moderator'
                          : user.role_id === 3
                            ? 'User'
                            : 'Unknown'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {user.is_active ? (
                        <FaCheckCircle
                          style={{ color: 'green' }}
                          title="Active"
                        />
                      ) : (
                        <FaTimesCircle
                          style={{ color: 'red' }}
                          title="Inactive"
                        />
                      )}
                    </td>
                    <td className={style.actionsColumn}>
                      <button
                        className={style.menuButton}
                        onClick={() => toggleMenu(user.id)}
                      >
                        <FaEllipsisH />
                      </button>
                      {openMenuId === user.id && (
                        <div ref={menuRef} className={style.menu}>
                          {Number(loggedUser?.id) !== user.id &&
                            user.role_id !== 1 && ( // Hide Delete button if loggedUser?.id matches user.id
                              <button onClick={() => singDelete(user.id)}>
                                <FaTrash /> Delete
                              </button>
                            )}
                          <button>
                            <FaEdit /> Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={style.pagination}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? style.activePage : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <Modal isOpen={isExport} onClose={() => setisExport(false)}>
              <ExportCsv data={users} selectedUsers={selectedUsers}/>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
